import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema({ timestamps: true })
export class Session {
  @Prop({ required: true, unique: true })
  name: string; // S1, S2, etc.

  @Prop({ required: true })
  startTime: string; // 08:00

  @Prop({ required: true })
  endTime: string; // 09:30
}

export const SessionSchema = SchemaFactory.createForClass(Session);
