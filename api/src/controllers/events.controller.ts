import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { EventsService } from '../services/events.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { JoinEventDto } from '../dto/join-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll(
    @Query('groupId') groupId?: string,
    @Query('status') status?: string,
  ) {
    return this.eventsService.findAll(groupId, status);
  }

  @Get('user/:userId')
  getEventsByUser(@Param('userId', ParseObjectIdPipe) userId: string) {
    return this.eventsService.getEventsByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.eventsService.remove(id);
  }

  @Post(':id/join')
  joinEvent(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() joinEventDto: JoinEventDto,
  ) {
    return this.eventsService.joinEvent(id, joinEventDto);
  }

  @Patch(':id/participants/:userId/status')
  updateParticipantStatus(
    @Param('id', ParseObjectIdPipe) id: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body('status') status: string,
  ) {
    return this.eventsService.updateParticipantStatus(id, userId, status);
  }

  @Delete(':id/participants/:userId')
  removeParticipant(
    @Param('id', ParseObjectIdPipe) id: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
  ) {
    return this.eventsService.removeParticipant(id, userId);
  }
}
