import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(userId: string, title: string, message: string, reservationId?: string): Promise<NotificationDocument> {
    const notification = new this.notificationModel({
      user: new Types.ObjectId(userId),
      title,
      message,
      reservation: reservationId ? new Types.ObjectId(reservationId) : undefined,
    });
    return notification.save();
  }

  async findByUser(userId: string): Promise<NotificationDocument[]> {
    return this.notificationModel.find({ user: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec();
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this.notificationModel.findByIdAndUpdate(notificationId, { isRead: true }).exec();
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel.updateMany({ user: new Types.ObjectId(userId), isRead: false }, { isRead: true }).exec();
  }
}
