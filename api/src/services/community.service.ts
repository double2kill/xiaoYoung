import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AlumniGroup,
  AlumniGroupDocument,
} from '../schemas/alumni-group.schema';

@Injectable()
export class CommunityService {
  constructor(
    @InjectModel(AlumniGroup.name)
    private alumniGroupModel: Model<AlumniGroupDocument>,
  ) {}

  async findAll() {
    return this.alumniGroupModel.find().exec();
  }

  async findById(id: string) {
    return this.alumniGroupModel.findById(id).exec();
  }

  async create(createData: any) {
    const community = new this.alumniGroupModel(createData);
    return community.save();
  }

  async update(id: string, updateData: any) {
    return this.alumniGroupModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string) {
    return this.alumniGroupModel.findByIdAndDelete(id).exec();
  }

  async join(id: string) {
    return this.alumniGroupModel
      .findByIdAndUpdate(id, {
        $inc: { memberCount: 1 },
      })
      .exec();
  }
}
