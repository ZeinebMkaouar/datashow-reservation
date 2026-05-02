import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  PROFESSOR = 'PROFESSOR',
  ADMIN = 'ADMIN',
}

// Each slot stores the room name (string). Empty string = no class.
const ScheduleDaySchema = {
  S1: { type: String, default: '' },
  S2: { type: String, default: '' },
  S3: { type: String, default: '' },
  S4: { type: String, default: '' },
  S5: { type: String, default: '' },
  S6: { type: String, default: '' },
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
  schedule?: Record<string, Record<string, string>>;
}

export const UserSchema = SchemaFactory.createForClass(User);
