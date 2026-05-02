import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WeekDocument = Week & Document;

@Schema({ timestamps: true })
export class Week {
  @Prop({ required: true, unique: true })
  weekStart: Date; // Always a Monday

  @Prop({ default: false })
  isOpen: boolean;

  @Prop()
  openedAt: Date;
}

export const WeekSchema = SchemaFactory.createForClass(Week);
