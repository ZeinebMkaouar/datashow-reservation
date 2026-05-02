import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DataShowDocument = DataShow & Document;

export enum DataShowEtat {
  DISPONIBLE = 'disponible',
  EN_PANNE = 'en_panne',
}

@Schema({ timestamps: true })
export class DataShow {
  @Prop({ required: true, unique: true })
  numero: string;

  @Prop({ required: true })
  marque: string;

  @Prop({ required: true })
  modele: string;

  @Prop({ required: true })
  dateAchat: Date;

  @Prop({ required: true, enum: DataShowEtat, default: DataShowEtat.DISPONIBLE })
  etat: DataShowEtat;
}

export const DataShowSchema = SchemaFactory.createForClass(DataShow);
