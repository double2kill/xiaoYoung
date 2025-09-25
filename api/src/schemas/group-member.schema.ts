import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GroupMemberDocument = GroupMember & Document;

@Schema({ timestamps: true })
export class GroupMember {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Group' })
  groupId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['admin', 'member'],
    default: 'member',
  })
  role: string;

  @Prop({
    required: true,
    enum: ['approved', 'pending', 'rejected'],
    default: 'pending',
  })
  status: string;

  @Prop({ default: Date.now })
  joinedAt: Date;

  @Prop()
  approvedAt?: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;
}

export const GroupMemberSchema = SchemaFactory.createForClass(GroupMember);

GroupMemberSchema.index({ groupId: 1, userId: 1 }, { unique: true });
