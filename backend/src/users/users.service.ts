import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(userData: Partial<User>): Promise<UserDocument> {
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('-password').exec();
  }

  async updateSchedule(
    userId: string,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.schedule = {
      monday: { ...user.schedule?.monday, ...updateScheduleDto.monday },
      tuesday: { ...user.schedule?.tuesday, ...updateScheduleDto.tuesday },
      wednesday: { ...user.schedule?.wednesday, ...updateScheduleDto.wednesday },
      thursday: { ...user.schedule?.thursday, ...updateScheduleDto.thursday },
      friday: { ...user.schedule?.friday, ...updateScheduleDto.friday },
      saturday: { ...user.schedule?.saturday, ...updateScheduleDto.saturday },
    };

    user.markModified('schedule');
    return user.save();
  }

  async getSchedule(userId: string): Promise<Record<string, Record<string, string>>> {
    const user = await this.userModel.findById(userId).select('schedule').lean().exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return (user as any).schedule || {};
  }
}
