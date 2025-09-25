import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  GroupMember,
  GroupMemberDocument,
} from '../schemas/group-member.schema';

@Injectable()
export class GroupMembersService {
  constructor(
    @InjectModel(GroupMember.name)
    private groupMemberModel: Model<GroupMemberDocument>,
  ) {}

  async findByGroupId(groupId: string) {
    return this.groupMemberModel
      .find({ groupId, isDeleted: { $ne: true } })
      .populate('userId', 'name username email avatar company position')
      .exec();
  }

  async findByUserId(userId: string) {
    return this.groupMemberModel
      .find({ userId, isDeleted: { $ne: true } })
      .populate('groupId', 'name description groupType status')
      .exec();
  }

  async create(
    groupId: string,
    userId: string,
    role: 'admin' | 'member' = 'member',
  ) {
    const groupMember = new this.groupMemberModel({
      groupId,
      userId,
      role,
      status: 'pending',
      joinedAt: new Date(),
    });
    return groupMember.save();
  }

  async updateStatus(
    groupId: string,
    userId: string,
    status: 'approved' | 'rejected',
  ) {
    const updateData: any = { status };
    if (status === 'approved') {
      updateData.approvedAt = new Date();
    }

    return this.groupMemberModel
      .findOneAndUpdate({ groupId, userId }, updateData, { new: true })
      .populate('userId', 'name username email avatar company position')
      .exec();
  }

  async removeMember(groupId: string, userId: string) {
    return this.groupMemberModel
      .findOneAndUpdate(
        { groupId, userId },
        { isDeleted: true, deletedAt: new Date() },
        { new: true },
      )
      .exec();
  }

  async updateRole(groupId: string, userId: string, role: 'admin' | 'member') {
    return this.groupMemberModel
      .findOneAndUpdate({ groupId, userId }, { role }, { new: true })
      .populate('userId', 'name username email avatar company position')
      .exec();
  }

  async findAllRelations() {
    // 这个方法现在在AppController中实现
    // 因为成员数据存储在groups集合中，而不是单独的group-members集合
    return [];
  }
}
