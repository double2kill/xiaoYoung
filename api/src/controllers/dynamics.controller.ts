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

@Controller('admin/dynamics')
export class DynamicsController {
  constructor(private readonly dynamicsService: DynamicsService) {}

  @Post()
  create(@Body() createDynamicDto: CreateDynamicDto) {
    return this.dynamicsService.create(createDynamicDto);
  }

  @Get()
  async findAll(
    @Query('groupId') groupId?: string,
    @Query('authorId') authorId?: string,
    @Query('status') status?: string,
  ) {
    try {
      const dynamics = await this.dynamicsService.findAll(
        groupId,
        authorId,
        status,
      );
      return {
        code: 200,
        data: dynamics,
        message: '获取成功',
      };
    } catch (error) {
      return {
        code: 500,
        data: [],
        message: '获取动态列表失败',
      };
    }
  }

  @Get('user/:userId')
  getDynamicsByUser(@Param('userId', ParseObjectIdPipe) userId: string) {
    return this.dynamicsService.getDynamicsByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    try {
      const dynamic = await this.dynamicsService.findOne(id);
      return {
        code: 200,
        data: dynamic,
        message: '获取成功',
      };
    } catch (error) {
      return {
        code: 404,
        data: null,
        message: '动态不存在',
      };
    }
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateDynamicDto: UpdateDynamicDto,
  ) {
    return this.dynamicsService.update(id, updateDynamicDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    try {
      await this.dynamicsService.remove(id);
      return {
        code: 200,
        data: null,
        message: '归档成功',
      };
    } catch (error) {
      return {
        code: 404,
        data: null,
        message: '动态不存在或已归档',
      };
    }
  }

  @Post(':id/like')
  likeDynamic(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body('userId') userId: string,
  ) {
    return this.dynamicsService.likeDynamic(id, userId);
  }
}
