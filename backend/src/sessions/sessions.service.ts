import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from './session.schema';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  async findAll(): Promise<SessionDocument[]> {
    return this.sessionModel.find().sort({ name: 1 }).exec();
  }

  async create(dto: any): Promise<SessionDocument> {
    return new this.sessionModel(dto).save();
  }

  async update(id: string, dto: any): Promise<SessionDocument> {
    const session = await this.sessionModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!session) throw new NotFoundException('Session not found');
    return session;
  }

  async delete(id: string): Promise<void> {
    const result = await this.sessionModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Session not found');
  }
}
