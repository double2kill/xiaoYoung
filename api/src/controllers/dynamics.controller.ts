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
import { DynamicsService } from '../services/dynamics.service';
import { CreateDynamicDto } from '../dto/create-dynamic.dto';
import { UpdateDynamicDto } from '../dto/update-dynamic.dto';

@Controller('dynamics')
export class DynamicsController {
  constructor(private readonly dynamicsService: DynamicsService) {}

  @Post()
  create(@Body() createDynamicDto: CreateDynamicDto) {
    return this.dynamicsService.create(createDynamicDto);
  }

  @Get()
  findAll(
    @Query('groupId') groupId?: string,
    @Query('authorId') authorId?: string,
  ) {
    return this.dynamicsService.findAll(groupId, authorId);
  }

  @Get('user/:userId')
  getDynamicsByUser(@Param('userId', ParseObjectIdPipe) userId: string) {
    return this.dynamicsService.getDynamicsByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.dynamicsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateDynamicDto: UpdateDynamicDto,
  ) {
    return this.dynamicsService.update(id, updateDynamicDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.dynamicsService.remove(id);
  }

  @Post(':id/like')
  likeDynamic(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body('userId') userId: string,
  ) {
    return this.dynamicsService.likeDynamic(id, userId);
  }
}
