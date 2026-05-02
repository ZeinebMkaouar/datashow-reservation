import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClaimDocument = Claim & Document;

export enum ClaimStatus {
  OPEN = 'open',
  RESOLVED = 'resolved',
}

@Schema({ timestamps: true })
export class Claim {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  professeur: Types.ObjectId;

  @Prop({ required: true })
  datashowId: string; // DataShow numero (e.g. "DS-004")

  @Prop({ required: true })
  issueType: string;

  @Prop({ required: true })
  description: string;

  @Prop({ enum: ClaimStatus, default: ClaimStatus.OPEN })
  status: ClaimStatus;

  @Prop({ default: '' })
  adminResponse: string;

  @Prop()
  resolvedAt: Date;
}

export const ClaimSchema = SchemaFactory.createForClass(Claim);
