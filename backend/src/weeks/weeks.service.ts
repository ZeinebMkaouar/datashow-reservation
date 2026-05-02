import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Week, WeekDocument } from './week.schema';
import { CreateWeekDto } from './dto/create-week.dto';

@Injectable()
export class WeeksService {
  private readonly logger = new Logger(WeeksService.name);

  constructor(
    @InjectModel(Week.name) private weekModel: Model<WeekDocument>,
  ) {}

  async create(dto: CreateWeekDto): Promise<WeekDocument> {
    const week = new this.weekModel({
      weekStart: new Date(dto.weekStart),
      isOpen: dto.isOpen ?? false,
      openedAt: dto.isOpen ? new Date() : undefined,
    });
    return week.save();
  }

  async findAll(): Promise<WeekDocument[]> {
    return this.weekModel.find().sort({ weekStart: -1 }).exec();
  }

  async toggleOpen(id: string): Promise<WeekDocument> {
    const week = await this.weekModel.findById(id);
    if (!week) throw new NotFoundException('Week not found');

    week.isOpen = !week.isOpen;
    if (week.isOpen) {
      week.openedAt = new Date();
    }
    return week.save();
  }

  async delete(id: string): Promise<void> {
    const result = await this.weekModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Week not found');
  }

  /**
   * Check if a given date falls within an open week.
   */
  async isDateInOpenWeek(date: Date): Promise<boolean> {
    // Find the Monday of the week containing the given date
    const d = new Date(date);
    const dayOfWeek = d.getDay(); // 0=Sun, 1=Mon, ...
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday offset
    const monday = new Date(d);
    monday.setDate(d.getDate() - diff);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const week = await this.weekModel.findOne({
      weekStart: { $gte: monday, $lte: sunday },
      isOpen: true,
    }).exec();

    return !!week;
  }

  /**
   * Cron job: Every Monday at 00:00, auto-open the NEXT week (J-7 rule).
   * This means on Monday of week N, we open week N+1.
   */
  @Cron(CronExpression.EVERY_WEEK)
  async autoOpenNextWeek() {
    const nextMonday = new Date();
    nextMonday.setDate(nextMonday.getDate() + 7);
    nextMonday.setHours(0, 0, 0, 0);
    // Adjust to Monday
    const dayOfWeek = nextMonday.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    nextMonday.setDate(nextMonday.getDate() - diff);

    // Check if week already exists
    const existing = await this.weekModel.findOne({
      weekStart: nextMonday,
    });

    if (existing) {
      if (!existing.isOpen) {
        existing.isOpen = true;
        existing.openedAt = new Date();
        await existing.save();
        this.logger.log(`Auto-opened existing week: ${nextMonday.toISOString()}`);
      }
    } else {
      await this.weekModel.create({
        weekStart: nextMonday,
        isOpen: true,
        openedAt: new Date(),
      });
      this.logger.log(`Auto-created and opened week: ${nextMonday.toISOString()}`);
    }
  }
}
