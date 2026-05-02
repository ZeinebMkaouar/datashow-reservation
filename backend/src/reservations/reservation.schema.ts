import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReservationDocument = Reservation & Document;

export enum Seance {
  S1 = 'S1',
  S2 = 'S2',
  S3 = 'S3',
  S4 = 'S4',
  S5 = 'S5',
  S6 = 'S6',
}

export enum ReservationType {
  EMPLOI = 'emploi',
  RATTRAPAGE = 'rattrapage',
}

export enum ReservationStatus {
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, enum: Seance })
  seance: Seance;

  @Prop({ required: true })
  salle: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  professeur: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'DataShow' })
  datashow: Types.ObjectId;

  @Prop({ required: true, enum: ReservationType, default: ReservationType.EMPLOI })
  type: ReservationType;

  @Prop({ required: true, enum: ReservationStatus, default: ReservationStatus.CONFIRMED })
  status: ReservationStatus;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

// Compound index: one DataShow per seance per date
ReservationSchema.index({ date: 1, seance: 1, datashow: 1 }, { unique: true });
