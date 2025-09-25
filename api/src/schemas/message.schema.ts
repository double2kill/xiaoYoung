import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  senderId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  receiverId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: 'text' })
  type: string;

  @Prop([String])
  attachments?: string[];

  @Prop({ default: false })
  isRead: boolean;

  @Prop()
  readAt?: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.set('collection', 'messages');
