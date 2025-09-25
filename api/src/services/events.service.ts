import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event, EventDocument } from '../schemas/event.schema';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { JoinEventDto } from '../dto/join-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    // 转换数据格式
    const eventData = {
      ...createEventDto,
      groupId: new Types.ObjectId(createEventDto.groupId),
      createdBy: new Types.ObjectId(createEventDto.createdBy),
      startTime: new Date(createEventDto.startTime),
      endTime: new Date(createEventDto.endTime),
      deadline: new Date(createEventDto.deadline),
    };

    const event = new this.eventModel(eventData);
    return event.save();
  }

  async findAll(groupId?: string, status?: string): Promise<Event[]> {
    const filter: any = { isDeleted: false };

    if (groupId) {
      filter.groupId = new Types.ObjectId(groupId);
    }

    if (status) {
      filter.status = status;
    }

    return this.eventModel
      .find(filter)
      .populate('createdBy', 'name email')
      .populate('groupId', 'name')
      .exec();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventModel
      .findOne({ _id: id, isDeleted: false })
      .populate('createdBy', 'name email')
      .populate('groupId', 'name')
      .populate('participants.userId', 'name email')
      .exec();

    if (!event) {
      throw new NotFoundException('活动不存在');
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.eventModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, updateEventDto, {
        new: true,
      })
      .populate('createdBy', 'name email')
      .populate('groupId', 'name')
      .exec();

    if (!event) {
      throw new NotFoundException('活动不存在');
    }

    return event;
  }

  async remove(id: string): Promise<void> {
    const event = await this.eventModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true, deletedAt: new Date() },
      )
      .exec();

    if (!event) {
      throw new NotFoundException('活动不存在');
    }
  }

  async joinEvent(eventId: string, joinEventDto: JoinEventDto): Promise<Event> {
    const event = await this.eventModel.findById(eventId);

    if (!event) {
      throw new NotFoundException('活动不存在');
    }

    if (event.isDeleted) {
      throw new NotFoundException('活动已删除');
    }

    if (event.participants.length >= event.maxParticipants) {
      throw new BadRequestException('活动人数已满');
    }

    const existingParticipant = event.participants.find(
      (p) => p.userId.toString() === joinEventDto.userId,
    );

    if (existingParticipant) {
      throw new BadRequestException('用户已参与此活动');
    }

    event.participants.push({
      userId: new Types.ObjectId(joinEventDto.userId),
      status:
        (joinEventDto.status as 'pending' | 'approved' | 'rejected') ||
        'pending',
      joinedAt: new Date(),
    });

    return event.save();
  }

  async updateParticipantStatus(
    eventId: string,
    userId: string,
    status: string,
  ): Promise<Event> {
    const event = await this.eventModel.findById(eventId);

    if (!event) {
      throw new NotFoundException('活动不存在');
    }

    const participant = event.participants.find(
      (p) => p.userId.toString() === userId,
    );

    if (!participant) {
      throw new NotFoundException('用户未参与此活动');
    }

    participant.status = status as 'pending' | 'approved' | 'rejected';

    return event.save();
  }

  async removeParticipant(eventId: string, userId: string): Promise<Event> {
    const event = await this.eventModel.findById(eventId);

    if (!event) {
      throw new NotFoundException('活动不存在');
    }

    event.participants = event.participants.filter(
      (p) => p.userId.toString() !== userId,
    );

    return event.save();
  }

  async getEventsByUser(userId: string): Promise<Event[]> {
    return this.eventModel
      .find({
        'participants.userId': new Types.ObjectId(userId),
        isDeleted: false,
      })
      .populate('createdBy', 'name email')
      .populate('groupId', 'name')
      .exec();
  }
}
