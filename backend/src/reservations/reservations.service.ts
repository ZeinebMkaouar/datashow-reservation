import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Reservation,
  ReservationDocument,
  ReservationStatus,
  Seance,
} from './reservation.schema';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { WeeksService } from '../weeks/weeks.service';
import { DataShowsService } from '../datashows/datashows.service';
import { RoomsService } from '../rooms/rooms.service';
import { UsersService } from '../users/users.service';
import { DataShowEtat } from '../datashows/datashow.schema';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
    private weeksService: WeeksService,
    private dataShowsService: DataShowsService,
    private roomsService: RoomsService,
    private usersService: UsersService,
  ) {}

  /**
   * PRÉ-REMPLISSAGE: Returns the schedule suggestion for a professor on a given date.
   */
  async getSuggestion(userId: string, dateStr: string) {
    // Parse dateStr (YYYY-MM-DD) as local time to avoid timezone offset bugs
    const [year, month, day] = dateStr.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[date.getDay()];

    const schedule = await this.usersService.getSchedule(userId);
    const daySchedule = schedule[dayName] || {};

    // Return all slots that have a room assigned
    const suggestions: { seance: string; salle: string }[] = [];
    for (const [slot, room] of Object.entries(daySchedule)) {
      if (slot.startsWith('_')) continue; // skip Mongoose _id field
      if (typeof room === 'string' && room.trim() !== '' && room !== 'false') {
        suggestions.push({ seance: slot, salle: room });
      }
    }

    return { date: dateStr, day: dayName, suggestions };
  }

  /**
   * CREATE RESERVATION with all business rule validations.
   */
  async create(userId: string, dto: CreateReservationDto) {
    const reservationDate = new Date(dto.date);
    reservationDate.setHours(0, 0, 0, 0);

    const warnings: string[] = [];

    // ── Constraint 1: Week must be open ──
    const isOpen = await this.weeksService.isDateInOpenWeek(reservationDate);
    if (!isOpen) {
      throw new ForbiddenException(
        'Reservations are not allowed for this week. The week is not open.',
      );
    }

    // ── Constraint 2: DataShow must not be broken ──
    const datashow = await this.dataShowsService.findById(dto.datashow);
    if (datashow.etat === DataShowEtat.EN_PANNE) {
      throw new BadRequestException(
        `DataShow "${datashow.numero}" is currently broken and cannot be reserved.`,
      );
    }

    // ── Constraint 3: DataShow must not be already reserved for same date+seance ──
    const dsConflict = await this.reservationModel.findOne({
      date: reservationDate,
      seance: dto.seance,
      datashow: new Types.ObjectId(dto.datashow),
      status: { $ne: ReservationStatus.CANCELLED },
    });
    if (dsConflict) {
      throw new ConflictException(
        `DataShow "${datashow.numero}" is already reserved for ${dto.seance} on this date.`,
      );
    }

    // ── Constraint 4: Professor must not have another reservation on same date+seance ──
    const profConflict = await this.reservationModel.findOne({
      date: reservationDate,
      seance: dto.seance,
      professeur: new Types.ObjectId(userId),
      status: { $ne: ReservationStatus.CANCELLED },
    });
    if (profConflict) {
      throw new ConflictException(
        `You already have a reservation for ${dto.seance} on this date.`,
      );
    }

    // ── Warning: Room equipped (not blocking) ──
    const isEquipped = await this.roomsService.isEquipped(dto.salle);
    if (isEquipped) {
      warnings.push(
        `Room "${dto.salle}" is already equipped with a built-in projector/TV.`,
      );
    }

    // ── Create the reservation ──
    const reservation = new this.reservationModel({
      date: reservationDate,
      seance: dto.seance,
      salle: dto.salle,
      professeur: new Types.ObjectId(userId),
      datashow: new Types.ObjectId(dto.datashow),
      type: dto.type || 'emploi',
      status: ReservationStatus.CONFIRMED,
    });

    const saved = await reservation.save();

    // ── Auto-save rattrapage to professor schedule ──
    if (dto.type === 'rattrapage') {
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = dayNames[reservationDate.getDay()];
      if (dayName !== 'sunday') {
        try {
          await this.usersService.updateSchedule(userId, {
            [dayName]: { [dto.seance]: dto.salle },
          });
        } catch {
          // Non-blocking: schedule update failure shouldn't break the reservation
        }
      }
    }

    return {
      reservation: saved,
      warnings,
    };
  }

  /**
   * Get available DataShows for a specific date and seance.
   */
  async getAvailableDataShows(dateStr: string, seance: Seance) {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);

    // Get all DataShows that are not broken
    const allAvailable = await this.dataShowsService.findAvailable();

    // Get IDs of DataShows already reserved for this date+seance
    const reservedDocs = await this.reservationModel
      .find({
        date,
        seance,
        status: { $ne: ReservationStatus.CANCELLED },
      })
      .select('datashow')
      .exec();

    const reservedIds = new Set(
      reservedDocs.map((r) => r.datashow.toString()),
    );

    // Filter out reserved ones
    return allAvailable.filter(
      (ds) => !reservedIds.has((ds._id as Types.ObjectId).toString()),
    );
  }

  /**
   * Find all reservations for a professor with filtering.
   */
  async findByProfessor(
    userId: string,
    query?: { search?: string; status?: string },
  ): Promise<any[]> {
    const filter: any = { professeur: new Types.ObjectId(userId) };

    if (query?.status && query.status !== 'All Status') {
      filter.status = query.status;
    }

    if (query?.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [{ salle: searchRegex }];
    }

    let result = await this.reservationModel
      .find(filter)
      .populate('datashow', 'numero marque modele etat')
      .sort({ date: -1 })
      .exec();

    // Secondary filtering for DataShow number if search is provided
    if (query?.search) {
      const searchRegex = new RegExp(query.search, 'i');
      result = result.filter((r: any) => 
        r.salle?.match(searchRegex) || 
        r.datashow?.numero?.match(searchRegex)
      );
    }

    return result;
  }

  /**
   * Find all reservations (admin view) with filtering and searching.
   */
  async findAll(query?: { search?: string; status?: string }): Promise<any[]> {
    const pipeline: any[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'professeur',
          foreignField: '_id',
          as: 'professeur',
        },
      },
      { $unwind: '$professeur' },
      {
        $lookup: {
          from: 'datashows',
          localField: 'datashow',
          foreignField: '_id',
          as: 'datashow',
        },
      },
      { $unwind: '$datashow' },
    ];

    const match: any = {};
    if (query?.status && query.status !== 'all') {
      match.status = query.status;
    }

    if (query?.search) {
      const searchRegex = { $regex: query.search, $options: 'i' };
      match.$or = [
        { salle: searchRegex },
        { 'professeur.fullName': searchRegex },
        { 'datashow.numero': searchRegex },
      ];
    }

    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    pipeline.push({ $sort: { date: -1 } });

    // Project to match the expected format (populating usually returns object with _id, etc)
    pipeline.push({
      $project: {
        _id: 1,
        date: 1,
        seance: 1,
        salle: 1,
        status: 1,
        type: 1,
        'professeur._id': 1,
        'professeur.fullName': 1,
        'professeur.email': 1,
        'datashow._id': 1,
        'datashow.numero': 1,
        'datashow.marque': 1,
        'datashow.modele': 1,
        'datashow.etat': 1,
      },
    });

    return this.reservationModel.aggregate(pipeline).exec();
  }

  /**
   * Cancel a reservation (soft cancel).
   */
  async cancel(reservationId: string, userId: string): Promise<ReservationDocument> {
    const reservation = await this.reservationModel.findById(reservationId);
    if (!reservation) throw new NotFoundException('Reservation not found');

    if (reservation.professeur.toString() !== userId) {
      throw new ForbiddenException('You can only cancel your own reservations');
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException('Reservation is already cancelled');
    }

    reservation.status = ReservationStatus.CANCELLED;
    return reservation.save();
  }
}
