import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from './room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<RoomDocument> {
    const existing = await this.roomModel.findOne({ name: createRoomDto.name });
    if (existing) {
      throw new ConflictException(`Room "${createRoomDto.name}" already exists`);
    }
    return new this.roomModel(createRoomDto).save();
  }

  async findAll(search?: string): Promise<RoomDocument[]> {
    const filter = search
      ? {
          $or: [
            { name: new RegExp(search, 'i') },
            { building: new RegExp(search, 'i') },
          ],
        }
      : {};
    return this.roomModel.find(filter).sort({ name: 1 }).exec();
  }

  async findById(id: string): Promise<RoomDocument> {
    const room = await this.roomModel.findById(id).exec();
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async findByName(name: string): Promise<RoomDocument | null> {
    return this.roomModel.findOne({ name }).exec();
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<RoomDocument> {
    const room = await this.roomModel
      .findByIdAndUpdate(id, updateRoomDto, { new: true })
      .exec();
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async delete(id: string): Promise<void> {
    const result = await this.roomModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Room not found');
  }

  async isEquipped(roomName: string): Promise<boolean> {
    const room = await this.roomModel.findOne({ name: roomName }).exec();
    return room?.hasEquipment ?? false;
  }
}
