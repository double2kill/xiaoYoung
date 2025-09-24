import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AlumniGroup,
  AlumniGroupDocument,
} from '../schemas/alumni-group.schema';

@Controller('admin/community')
export class CommunityController {
  constructor(
    @InjectModel(AlumniGroup.name)
    private alumniGroupModel: Model<AlumniGroupDocument>,
  ) {}

  @Get()
  async getCommunity() {
    try {
      const communities = await this.alumniGroupModel.find().exec();
      return {
        code: 200,
        data: communities.map((community) => ({
          id: community._id,
          name: community.name,
          memberCount: community.memberCount,
          rating: community.rating,
          contactName: community.contactName,
          contactPhone: community.contactPhone,
          description: community.description,
          createTime: community.createTime,
          lastActiveTime: community.lastActiveTime,
        })),
        message: '获取成功',
      };
    } catch (error) {
      return {
        code: 500,
        data: [],
        message: '获取校友会列表失败',
      };
    }
  }

  @Get(':id')
  async getCommunityDetail(@Param('id') id: string) {
    try {
      const community = await this.alumniGroupModel.findById(id).exec();
      if (community) {
        return {
          code: 200,
          data: {
            id: community._id,
            name: community.name,
            memberCount: community.memberCount,
            rating: community.rating,
            contactName: community.contactName,
            contactPhone: community.contactPhone,
            description: community.description,
            createTime: community.createTime,
            lastActiveTime: community.lastActiveTime,
          },
          message: '获取成功',
        };
      } else {
        return {
          code: 404,
          data: null,
          message: '校友会不存在',
        };
      }
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: '获取校友会详情失败',
      };
    }
  }

  @Post()
  async createCommunity(@Body() createData: any) {
    try {
      const community = new this.alumniGroupModel(createData);
      const savedCommunity = await community.save();
      return {
        code: 200,
        data: {
          id: savedCommunity._id,
          name: savedCommunity.name,
          memberCount: savedCommunity.memberCount,
          rating: savedCommunity.rating,
          contactName: savedCommunity.contactName,
          contactPhone: savedCommunity.contactPhone,
          description: savedCommunity.description,
          createTime: savedCommunity.createTime,
          lastActiveTime: savedCommunity.lastActiveTime,
        },
        message: '创建成功',
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: '创建失败',
      };
    }
  }

  @Put(':id')
  async updateCommunity(@Param('id') id: string, @Body() updateData: any) {
    try {
      const community = await this.alumniGroupModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();

      if (community) {
        return {
          code: 200,
          data: {
            id: community._id,
            name: community.name,
            memberCount: community.memberCount,
            rating: community.rating,
            contactName: community.contactName,
            contactPhone: community.contactPhone,
            description: community.description,
            createTime: community.createTime,
            lastActiveTime: community.lastActiveTime,
          },
          message: '更新成功',
        };
      } else {
        return {
          code: 404,
          data: null,
          message: '校友会不存在',
        };
      }
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: '更新失败',
      };
    }
  }

  @Delete(':id')
  async deleteCommunity(@Param('id') id: string) {
    try {
      const result = await this.alumniGroupModel.findByIdAndDelete(id).exec();
      if (result) {
        return {
          code: 200,
          data: { success: true },
          message: '删除成功',
        };
      } else {
        return {
          code: 404,
          data: { success: false },
          message: '校友会不存在',
        };
      }
    } catch (error) {
      return {
        code: 500,
        data: { success: false },
        message: '删除失败',
      };
    }
  }

  @Post(':id/join')
  async joinCommunity(@Param('id') id: string) {
    try {
      const community = await this.alumniGroupModel.findById(id).exec();
      if (community) {
        await this.alumniGroupModel
          .findByIdAndUpdate(id, {
            $inc: { memberCount: 1 },
          })
          .exec();
        return {
          code: 200,
          data: { success: true },
          message: '加入成功',
        };
      } else {
        return {
          code: 404,
          data: { success: false },
          message: '校友会不存在',
        };
      }
    } catch (error) {
      return {
        code: 500,
        data: { success: false },
        message: '加入失败',
      };
    }
  }
}
