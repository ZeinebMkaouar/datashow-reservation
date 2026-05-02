import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RepairDocument = Repair & Document;

export enum RepairStatus {
  EN_COURS = 'en_cours',
  TERMINEE = 'terminee',
}

@Schema({ timestamps: true })
export class Repair {
  @Prop({ required: true, type: Types.ObjectId, ref: 'DataShow' })
  datashow: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  technician: string;

  @Prop({ enum: RepairStatus, default: RepairStatus.EN_COURS })
  status: RepairStatus;
}

export const RepairSchema = SchemaFactory.createForClass(Repair);
