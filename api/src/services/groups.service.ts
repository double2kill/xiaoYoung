import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Group, GroupDocument } from '../schemas/group.schema';
import { User, UserDocument } from '../schemas/user.schema';
import {
  GroupMember,
  GroupMemberDocument,
} from '../schemas/group-member.schema';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name)
    private groupModel: Model<GroupDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(GroupMember.name)
    private groupMemberModel: Model<GroupMemberDocument>,
  ) {}

  async findAll() {
    return this.groupModel.find({ isDeleted: { $ne: true } }).exec();
  }

  async findById(id: string) {
    return this.groupModel
      .findOne({ _id: id, isDeleted: { $ne: true } })
      .exec();
  }

  async create(createData: any) {
    const group = new this.groupModel(createData);
    return group.save();
  }

  async update(id: string, updateData: any) {
    return this.groupModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string) {
    return this.groupModel
      .findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true },
      )
      .exec();
  }

  async joinGroup(
    groupId: string,
    userId: string,
    role: 'admin' | 'member' = 'member',
  ) {
    return this.groupModel
      .findByIdAndUpdate(
        groupId,
        {
          $push: {
            members: {
              userId,
              role,
              status: 'pending',
              joinedAt: new Date(),
            },
          },
        },
        { new: true },
      )
      .exec();
  }

  async approveMember(groupId: string, userId: string) {
    return this.groupModel
      .findOneAndUpdate(
        {
          _id: groupId,
          'members.userId': userId,
        },
        {
          $set: {
            'members.$.status': 'approved',
          },
        },
        { new: true },
      )
      .exec();
  }

  async updateGroupStatus(
    id: string,
    status: 'pending' | 'approved' | 'rejected',
  ) {
    return this.groupModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
  }

  async getGroupMembers(id: string) {
    // 验证圈子是否存在
    const group = await this.groupModel.findById(id).exec();
    if (!group) {
      throw new Error('圈子不存在');
    }

    // 获取所有成员的用户详细信息
    const membersWithUsers = await Promise.all(
      (group.members || []).map(async (member) => {
        const user = await this.userModel
          .findById(member.userId)
          .select('name username email avatar company position')
          .exec();

        return {
          userId: String(member.userId),
          user: user
            ? {
                id: String(user.id),
                name: user.name,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                company: user.company,
                position: user.position,
              }
            : null,
          role: member.role,
          status: member.status,
          joinedAt: member.joinedAt,
        };
      }),
    );

    return membersWithUsers;
  }

  async addGroupMember(
    groupId: string,
    userId: string,
    role: 'admin' | 'member' = 'member',
  ) {
    // 验证用户ID格式
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error(`无效的用户ID格式: ${userId}`);
    }

    // 验证用户是否存在
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error('用户不存在');
    }

    // 验证圈子是否存在
    const group = await this.groupModel.findById(groupId).exec();
    if (!group) {
      throw new Error('圈子不存在');
    }

    // 检查用户是否已经是成员
    const existingMember = group.members.find(
      (member) => member.userId.toString() === userId,
    );
    if (existingMember) {
      throw new Error('用户已经是圈子成员');
    }

    // 添加成员到圈子
    const updatedGroup = await this.groupModel
      .findByIdAndUpdate(
        groupId,
        {
          $push: {
            members: {
              userId: new Types.ObjectId(userId),
              role,
              status: 'approved',
              joinedAt: new Date(),
            },
          },
        },
        { new: true },
      )
      .exec();

    return updatedGroup;
  }

  async updateMemberStatus(
    groupId: string,
    userId: string,
    status: 'approved' | 'rejected',
  ) {
    return this.groupModel
      .findOneAndUpdate(
        {
          _id: groupId,
          'members.userId': new Types.ObjectId(userId),
        },
        {
          $set: {
            'members.$.status': status,
            'members.$.approvedAt': new Date(),
          },
        },
        { new: true },
      )
      .populate('members.userId', 'name username email avatar company position')
      .exec();
  }

  async removeGroupMember(groupId: string, userId: string) {
    return this.groupModel
      .findByIdAndUpdate(
        groupId,
        {
          $pull: {
            members: { userId: new Types.ObjectId(userId) },
          },
        },
        { new: true },
      )
      .exec();
  }

  async restore(id: string) {
    return this.groupModel
      .findByIdAndUpdate(
        id,
        { isDeleted: false, deletedAt: null },
        { new: true },
      )
      .exec();
  }

  async updateMemberRole(
    groupId: string,
    userId: string,
    role: 'admin' | 'member',
  ) {
    const group = await this.groupModel.findById(groupId).exec();
    if (!group) {
      throw new Error('圈子不存在');
    }

    const memberExists = group.members.find(
      (member) => member.userId.toString() === userId,
    );
    if (!memberExists) {
      throw new Error('成员不存在');
    }

    return this.groupModel
      .findOneAndUpdate(
        {
          _id: groupId,
          'members.userId': new Types.ObjectId(userId),
        },
        {
          $set: {
            'members.$.role': role,
          },
        },
        { new: true },
      )
      .exec();
  }
}
