import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from '../schemas/message.schema';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const messageData = {
      ...createMessageDto,
      senderId: new Types.ObjectId(createMessageDto.senderId),
      receiverId: new Types.ObjectId(createMessageDto.receiverId),
    };

    const message = new this.messageModel(messageData);
    return message.save();
  }

  async findAll(
    userId?: string,
    conversationId?: string,
    isRead?: boolean,
  ): Promise<Message[]> {
    const filter: any = { isDeleted: false };

    if (userId) {
      filter.$or = [
        { senderId: new Types.ObjectId(userId) },
        { receiverId: new Types.ObjectId(userId) },
      ];
    }

    if (conversationId) {
      const participants = conversationId.split('-');
      if (participants.length === 2) {
        filter.$or = [
          {
            senderId: new Types.ObjectId(participants[0]),
            receiverId: new Types.ObjectId(participants[1]),
          },
          {
            senderId: new Types.ObjectId(participants[1]),
            receiverId: new Types.ObjectId(participants[0]),
          },
        ];
      }
    }

    if (isRead !== undefined) {
      filter.isRead = isRead;
    }

    return this.messageModel
      .find(filter)
      .populate('senderId', 'name email avatar')
      .populate('receiverId', 'name email avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Message> {
    const message = await this.messageModel
      .findOne({ _id: id, isDeleted: false })
      .populate('senderId', 'name email avatar')
      .populate('receiverId', 'name email avatar')
      .exec();

    if (!message) {
      throw new NotFoundException('消息不存在');
    }

    return message;
  }

  async update(
    id: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    const message = await this.messageModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, updateMessageDto, {
        new: true,
      })
      .populate('senderId', 'name email avatar')
      .populate('receiverId', 'name email avatar')
      .exec();

    if (!message) {
      throw new NotFoundException('消息不存在');
    }

    return message;
  }

  async remove(id: string): Promise<void> {
    const message = await this.messageModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true, deletedAt: new Date() },
      )
      .exec();

    if (!message) {
      throw new NotFoundException('消息不存在');
    }
  }

  async markAsRead(messageId: string, userId: string): Promise<Message> {
    const message = await this.messageModel.findById(messageId);

    if (!message) {
      throw new NotFoundException('消息不存在');
    }

    if (message.receiverId.toString() !== userId) {
      throw new BadRequestException('无权限标记此消息为已读');
    }

    message.isRead = true;
    message.readAt = new Date();

    return message.save();
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.messageModel.updateMany(
      {
        receiverId: new Types.ObjectId(userId),
        isRead: false,
        isDeleted: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      },
    );
  }

  async getConversations(userId: string): Promise<any[]> {
    const conversations = await this.messageModel.aggregate([
      {
        $match: {
          $or: [
            { senderId: new Types.ObjectId(userId) },
            { receiverId: new Types.ObjectId(userId) },
          ],
          isDeleted: false,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', new Types.ObjectId(userId)] },
              '$receiverId',
              '$senderId',
            ],
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiverId', new Types.ObjectId(userId)] },
                    { $eq: ['$isRead', false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 1,
          user: {
            _id: '$user._id',
            name: '$user.name',
            email: '$user.email',
            avatar: '$user.avatar',
          },
          lastMessage: 1,
          unreadCount: 1,
        },
      },
    ]);

    return conversations;
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.messageModel.countDocuments({
      receiverId: new Types.ObjectId(userId),
      isRead: false,
      isDeleted: false,
    });
  }
}
