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
import { MessagesService } from '../services/messages.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Get()
  findAll(
    @Query('userId') userId?: string,
    @Query('conversationId') conversationId?: string,
    @Query('isRead') isRead?: boolean,
  ) {
    return this.messagesService.findAll(userId, conversationId, isRead);
  }

  @Get('conversations/:userId')
  getConversations(@Param('userId', ParseObjectIdPipe) userId: string) {
    return this.messagesService.getConversations(userId);
  }

  @Get('unread-count/:userId')
  getUnreadCount(@Param('userId', ParseObjectIdPipe) userId: string) {
    return this.messagesService.getUnreadCount(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.messagesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.messagesService.remove(id);
  }

  @Patch(':id/read')
  markAsRead(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body('userId') userId: string,
  ) {
    return this.messagesService.markAsRead(id, userId);
  }

  @Patch('read-all/:userId')
  markAllAsRead(@Param('userId', ParseObjectIdPipe) userId: string) {
    return this.messagesService.markAllAsRead(userId);
  }
}
