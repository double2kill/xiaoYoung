import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Dynamic, DynamicDocument } from '../schemas/dynamic.schema';
import { CreateDynamicDto } from '../dto/create-dynamic.dto';
import { UpdateDynamicDto } from '../dto/update-dynamic.dto';

@Injectable()
export class DynamicsService {
  constructor(
    @InjectModel(Dynamic.name) private dynamicModel: Model<DynamicDocument>,
  ) {}

  async create(createDynamicDto: CreateDynamicDto): Promise<Dynamic> {
    const dynamicData = {
      ...createDynamicDto,
      authorId: new Types.ObjectId(createDynamicDto.authorId),
      groupId: createDynamicDto.groupId
        ? new Types.ObjectId(createDynamicDto.groupId)
        : undefined,
    };

    const dynamic = new this.dynamicModel(dynamicData);
    return dynamic.save();
  }

  async findAll(
    groupId?: string,
    authorId?: string,
    status?: string,
  ): Promise<Dynamic[]> {
    const filter: any = { isDeleted: false };

    if (groupId) {
      filter.groupId = new Types.ObjectId(groupId);
    }

    if (authorId) {
      filter.authorId = new Types.ObjectId(authorId);
    }

    if (status) {
      filter.status = status;
    }

    return this.dynamicModel
      .find(filter)
      .populate('authorId', 'name email avatar')
      .populate('groupId', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Dynamic> {
    const dynamic = await this.dynamicModel
      .findOne({ _id: id, isDeleted: false })
      .populate('authorId', 'name email avatar')
      .populate('groupId', 'name')
      .exec();

    if (!dynamic) {
      throw new NotFoundException('动态不存在');
    }

    return dynamic;
  }

  async update(
    id: string,
    updateDynamicDto: UpdateDynamicDto,
  ): Promise<Dynamic> {
    const dynamic = await this.dynamicModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, updateDynamicDto, {
        new: true,
      })
      .populate('authorId', 'name email avatar')
      .populate('groupId', 'name')
      .exec();

    if (!dynamic) {
      throw new NotFoundException('动态不存在');
    }

    return dynamic;
  }

  async remove(id: string): Promise<void> {
    const dynamic = await this.dynamicModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true, deletedAt: new Date() },
      )
      .exec();

    if (!dynamic) {
      throw new NotFoundException('动态不存在');
    }
  }

  async likeDynamic(dynamicId: string, userId: string): Promise<Dynamic> {
    const dynamic = await this.dynamicModel.findById(dynamicId);

    if (!dynamic) {
      throw new NotFoundException('动态不存在');
    }

    if (dynamic.isDeleted) {
      throw new NotFoundException('动态已删除');
    }

    const userObjectId = new Types.ObjectId(userId);
    const isLiked = dynamic.likedBy.includes(userObjectId);

    if (isLiked) {
      dynamic.likedBy = dynamic.likedBy.filter(
        (id) => !id.equals(userObjectId),
      );
      dynamic.likes = Math.max(0, dynamic.likes - 1);
    } else {
      dynamic.likedBy.push(userObjectId);
      dynamic.likes += 1;
    }

    return dynamic.save();
  }

  async getDynamicsByUser(userId: string): Promise<Dynamic[]> {
    return this.dynamicModel
      .find({
        authorId: new Types.ObjectId(userId),
        isDeleted: false,
      })
      .populate('authorId', 'name email avatar')
      .populate('groupId', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }
}
