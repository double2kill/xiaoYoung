import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DynamicDocument = Dynamic & Document;

@Schema({ timestamps: true })
export class Dynamic {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  authorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Group' })
  groupId?: Types.ObjectId;

  @Prop([String])
  images?: string[];

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: 0 })
  comments: number;

  @Prop({ default: 0 })
  shares: number;

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  likedBy: Types.ObjectId[];

  @Prop({ default: 'published' })
  status: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;
}

export const DynamicSchema = SchemaFactory.createForClass(Dynamic);
DynamicSchema.set('collection', 'dynamics');
