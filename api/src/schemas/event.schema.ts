import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Group' })
  groupId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ required: true })
  maxParticipants: number;

  @Prop()
  requirements?: string;

  @Prop()
  safetyNotice?: string;

  @Prop()
  feeInfo?: string;

  @Prop({ required: true })
  deadline: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: string;

  @Prop([String])
  tags?: string[];

  @Prop({
    type: [
      {
        userId: { type: Types.ObjectId, ref: 'User', required: true },
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected'],
          required: true,
          default: 'pending',
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  participants: Array<{
    userId: Types.ObjectId;
    status: 'pending' | 'approved' | 'rejected';
    joinedAt: Date;
  }>;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.index({ groupId: 1 });
EventSchema.index({ 'participants.userId': 1 });
EventSchema.index({ status: 1 });
