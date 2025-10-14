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
    return this.groupModel
      .find({ isDeleted: { $ne: true } })
      .populate('createdBy', 'name username email avatar company position')
      .populate('members.userId', 'name username email avatar company position')
      .exec();
  }

  async findById(id: string) {
    return this.groupModel
      .findOne({ _id: id, isDeleted: { $ne: true } })
      .populate('createdBy', 'name username email avatar company position')
      .exec();
  }

  async create(createData: any) {
    const groupData = {
      ...createData,
      createdBy: new Types.ObjectId(createData.createdBy),
      members: [
        {
          userId: new Types.ObjectId(createData.createdBy),
          role: 'admin',
          status: 'approved',
          joinedAt: new Date(),
        },
      ],
    };
    const group = new this.groupModel(groupData);
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

    // 对于数字ID，直接使用字符串形式存储
    // 对于ObjectId格式，转换为ObjectId
    let userIdToStore;
    if (Types.ObjectId.isValid(userId)) {
      userIdToStore = new Types.ObjectId(userId);
    } else {
      // 对于数字ID，直接使用字符串
      userIdToStore = userId;
    }

    return this.groupModel
      .findByIdAndUpdate(
        groupId,
        {
          $push: {
            members: {
              userId: userIdToStore,
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
        // 根据 userId 类型生成用户信息
        let userInfo = {
          id: String(member.userId),
          name: '未知用户',
          username: '',
          email: '',
          avatar: '',
          company: '',
          position: '',
        };

        // 检查是否是数字ID或时间戳ID
        const userIdNum = Number(member.userId);
        if (!isNaN(userIdNum) && userIdNum > 0) {
          // 如果是时间戳格式的ID（13位数字），使用默认用户信息
          if (member.userId.length === 13) {
            userInfo = {
              id: String(member.userId),
              name: '用户' + member.userId.slice(-4),
              username: 'user_' + member.userId.slice(-4),
              email: '',
              avatar: '',
              company: '',
              position: '',
            };
          } else {
            // 如果是小数字ID，从模拟数据中查找
            const mockUsers = [
              {
                id: 1,
                username: 'zhangsan',
                name: '张三',
                email: 'zhangsan@example.com',
                avatar: '',
                company: '腾讯科技',
                position: '高级前端工程师',
              },
              {
                id: 2,
                username: 'lisi',
                name: '李四',
                email: 'lisi@example.com',
                avatar: '',
                company: '招商银行',
                position: '投资经理',
              },
              {
                id: 3,
                username: 'wangwu',
                name: '王五',
                email: 'wangwu@example.com',
                avatar: '',
                company: '北京大学',
                position: '高级讲师',
              },
              {
                id: 4,
                username: 'zhaoliu',
                name: '赵六',
                email: 'zhaoliu@example.com',
                avatar: '',
                company: '阿里巴巴',
                position: '产品经理',
              },
              {
                id: 5,
                username: 'chenqi',
                name: '陈七',
                email: 'chenqi@example.com',
                avatar: '',
                company: '字节跳动',
                position: 'UI设计师',
              },
              {
                id: 6,
                username: 'sunba',
                name: '孙八',
                email: 'sunba@example.com',
                avatar: '',
                company: '美团',
                position: '运营专员',
              },
            ];
            const user = mockUsers.find((u) => u.id === userIdNum);
            if (user) {
              userInfo = {
                id: String(user.id),
                name: user.name,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                company: user.company,
                position: user.position,
              };
            }
          }
        }

        return {
          userId: String(member.userId),
          user: userInfo,
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

    // 添加成员到圈子（直接使用字符串 userId）
    const updatedGroup = await this.groupModel
      .findByIdAndUpdate(
        groupId,
        {
          $push: {
            members: {
              userId: userId,
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
          'members.userId': userId,
        },
        {
          $set: {
            'members.$.status': status,
            'members.$.approvedAt': new Date(),
          },
        },
        { new: true },
      )
      .exec();
  }

  async removeGroupMember(groupId: string, userId: string) {
    return this.groupModel
      .findByIdAndUpdate(
        groupId,
        {
          $pull: {
            members: { userId: userId },
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
          'members.userId': userId,
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
