import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Repair, RepairDocument, RepairStatus } from './repair.schema';
import { CreateRepairDto } from './dto/create-repair.dto';
import { DataShowsService } from '../datashows/datashows.service';
import { DataShowEtat } from '../datashows/datashow.schema';

@Injectable()
export class RepairsService {
  constructor(
    @InjectModel(Repair.name) private repairModel: Model<RepairDocument>,
    private dataShowsService: DataShowsService,
  ) {}

  /**
   * Create a repair → Automatically set DataShow status to EN_PANNE.
   */
  async create(dto: CreateRepairDto): Promise<RepairDocument> {
    // Auto-toggle DataShow to "en_panne"
    await this.dataShowsService.updateEtat(dto.datashow, DataShowEtat.EN_PANNE);

    const repair = new this.repairModel({
      datashow: new Types.ObjectId(dto.datashow),
      date: new Date(dto.date),
      description: dto.description,
      action: dto.action,
      technician: dto.technician,
      status: RepairStatus.EN_COURS,
    });

    return repair.save();
  }

  /**
   * Mark a repair as done → Automatically set DataShow status to DISPONIBLE.
   */
  async markDone(repairId: string): Promise<RepairDocument> {
    const repair = await this.repairModel.findById(repairId);
    if (!repair) throw new NotFoundException('Repair not found');

    repair.status = RepairStatus.TERMINEE;
    await repair.save();

    // Auto-toggle DataShow back to "disponible"
    await this.dataShowsService.updateEtat(
      repair.datashow.toString(),
      DataShowEtat.DISPONIBLE,
    );

    return repair;
  }

  /**
   * Get repair history for a specific DataShow.
   */
  async findByDataShow(datashowId: string): Promise<RepairDocument[]> {
    return this.repairModel
      .find({ datashow: new Types.ObjectId(datashowId) })
      .sort({ date: -1 })
      .exec();
  }

  /**
   * Get all repairs with searching.
   */
  async findAll(search?: string): Promise<any[]> {
    const pipeline: any[] = [
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

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      pipeline.push({
        $match: {
          $or: [
            { 'datashow.numero': searchRegex },
            { description: searchRegex },
            { technician: searchRegex },
          ],
        },
      });
    }

    pipeline.push({ $sort: { date: -1 } });

    pipeline.push({
      $project: {
        _id: 1,
        date: 1,
        description: 1,
        action: 1,
        technician: 1,
        status: 1,
        'datashow._id': 1,
        'datashow.numero': 1,
        'datashow.marque': 1,
        'datashow.modele': 1,
        'datashow.etat': 1,
      },
    });

    return this.repairModel.aggregate(pipeline).exec();
  }
}
