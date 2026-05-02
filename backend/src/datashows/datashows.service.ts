import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataShow, DataShowDocument, DataShowEtat } from './datashow.schema';
import { CreateDataShowDto } from './dto/create-datashow.dto';
import { UpdateDataShowDto } from './dto/update-datashow.dto';

@Injectable()
export class DataShowsService {
  constructor(
    @InjectModel(DataShow.name) private dataShowModel: Model<DataShowDocument>,
  ) {}

  async create(dto: CreateDataShowDto): Promise<DataShowDocument> {
    const existing = await this.dataShowModel.findOne({ numero: dto.numero });
    if (existing) {
      throw new ConflictException(`DataShow "${dto.numero}" already exists`);
    }
    return new this.dataShowModel(dto).save();
  }

  async findAll(query?: { search?: string; etat?: string }): Promise<DataShowDocument[]> {
    const filter: any = {};
    if (query?.etat) {
      filter.etat = query.etat;
    }
    if (query?.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { numero: searchRegex },
        { marque: searchRegex },
        { modele: searchRegex },
      ];
    }
    return this.dataShowModel.find(filter).sort({ numero: 1 }).exec();
  }

  async findById(id: string): Promise<DataShowDocument> {
    const ds = await this.dataShowModel.findById(id).exec();
    if (!ds) throw new NotFoundException('DataShow not found');
    return ds;
  }

  async findByNumero(numero: string): Promise<DataShowDocument | null> {
    return this.dataShowModel.findOne({ numero }).exec();
  }

  async update(id: string, dto: UpdateDataShowDto): Promise<DataShowDocument> {
    const ds = await this.dataShowModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!ds) throw new NotFoundException('DataShow not found');
    return ds;
  }

  async updateEtat(id: string, etat: DataShowEtat): Promise<DataShowDocument> {
    const ds = await this.dataShowModel
      .findByIdAndUpdate(id, { etat }, { new: true })
      .exec();
    if (!ds) throw new NotFoundException('DataShow not found');
    return ds;
  }

  async delete(id: string): Promise<void> {
    const result = await this.dataShowModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('DataShow not found');
  }

  async findAvailable(): Promise<DataShowDocument[]> {
    return this.dataShowModel
      .find({ etat: DataShowEtat.DISPONIBLE })
      .sort({ numero: 1 })
      .exec();
  }
}
