import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AlumniGroupDocument = AlumniGroup & Document;

@Schema({ timestamps: true })
export class AlumniGroup {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  memberCount: number;

  @Prop({ type: [Boolean], required: true })
  rating: boolean[];

  @Prop({ required: true })
  contactName: string;

  @Prop({ required: true })
  contactPhone: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  createTime: string;

  @Prop({ required: true })
  lastActiveTime: string;
}

export const AlumniGroupSchema = SchemaFactory.createForClass(AlumniGroup);
