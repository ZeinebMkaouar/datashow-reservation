import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  PROFESSOR = 'PROFESSOR',
  ADMIN = 'ADMIN',
}

// Schedule slot type: each day has slots S1-S6
const ScheduleDaySchema = {
  S1: { type: Boolean, default: false },
  S2: { type: Boolean, default: false },
  S3: { type: Boolean, default: false },
  S4: { type: Boolean, default: false },
  S5: { type: Boolean, default: false },
  S6: { type: Boolean, default: false },
};

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.PROFESSOR })
  role: UserRole;

  @Prop(
    raw({
      monday: { type: ScheduleDaySchema, default: () => ({}) },
      tuesday: { type: ScheduleDaySchema, default: () => ({}) },
      wednesday: { type: ScheduleDaySchema, default: () => ({}) },
      thursday: { type: ScheduleDaySchema, default: () => ({}) },
      friday: { type: ScheduleDaySchema, default: () => ({}) },
      saturday: { type: ScheduleDaySchema, default: () => ({}) },
    }),
  )
  schedule?: Record<string, Record<string, boolean>>;
}

export const UserSchema = SchemaFactory.createForClass(User);
