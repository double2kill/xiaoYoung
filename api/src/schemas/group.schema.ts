import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GroupDocument = Group & Document;

@Schema({ timestamps: true })
export class Group {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  groupType: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: string;

  @Prop({
    type: [
      {
        userId: { type: String, required: true },
        role: { type: String, enum: ['admin', 'member'], required: true },
        status: { type: String, enum: ['approved', 'pending'], required: true },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  members: Array<{
    userId: string;
    role: 'admin' | 'member';
    status: 'approved' | 'pending';
    joinedAt: Date;
  }>;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
