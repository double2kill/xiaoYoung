import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop()
  avatar?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 'user' })
  role: string;

  @Prop()
  company?: string;

  @Prop()
  position?: string;

  @Prop()
  department?: string;

  @Prop()
  wechatId?: string;

  @Prop()
  lastLoginAt?: Date;

  @Prop({ default: 0 })
  loginCount: number;

  @Prop()
  industry?: string;

  @Prop()
  profession?: string;

  @Prop([String])
  interests?: string[];

  @Prop()
  experience?: string;

  @Prop([String])
  tags?: string[];

  @Prop({ default: 'active' })
  status: string;

  @Prop()
  createTime?: string;

  @Prop()
  lastLoginTime?: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('collection', 'users');
