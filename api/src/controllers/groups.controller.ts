import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { GroupsService } from '../services/groups.service';
import { GroupMembersService } from '../services/group-members.service';

@Controller('admin/groups')
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly groupMembersService: GroupMembersService,
  ) {}

  @Get()
  async getGroups() {
    try {
      const groups = await this.groupsService.findAll();
      return {
        code: 200,
        data: groups,
        message: '获取成功',
      };
    } catch (error) {
      return {
        code: 500,
        data: [],
        message: '获取群组列表失败',
      };
    }
  }

  @Get(':id')
  async getGroupDetail(@Param('id') id: string) {
    try {
      const group = await this.groupsService.findById(id);
      if (group) {
        return {
          code: 200,
          data: group,
          message: '获取成功',
        };
      } else {
        return {
          code: 404,
          data: null,
          message: '群组不存在',
        };
      }
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: '获取群组详情失败',
      };
    }
  }

  @Post()
  async createGroup(@Body() createData: any) {
    try {
      const group = await this.groupsService.create(createData);
      return {
        code: 200,
        data: group,
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
  async updateGroup(@Param('id') id: string, @Body() updateData: any) {
    try {
      const group = await this.groupsService.update(id, updateData);
      if (group) {
        return {
          code: 200,
          data: group,
          message: '更新成功',
        };
      } else {
        return {
          code: 404,
          data: null,
          message: '群组不存在',
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
  async deleteGroup(@Param('id') id: string) {
    try {
      const result = await this.groupsService.delete(id);
      if (result) {
        return {
          code: 200,
          data: { success: true },
          message: '归档成功',
        };
      } else {
        return {
          code: 404,
          data: { success: false },
          message: '群组不存在',
        };
      }
    } catch (error) {
      return {
        code: 500,
        data: { success: false },
        message: '归档失败',
      };
    }
  }

  @Put(':id/restore')
  async restoreGroup(@Param('id') id: string) {
    try {
      const result = await this.groupsService.restore(id);
      if (result) {
        return {
          code: 200,
          data: { success: true },
          message: '取消归档成功',
        };
      } else {
        return {
          code: 404,
          data: { success: false },
          message: '群组不存在',
        };
      }
    } catch (error) {
      return {
        code: 500,
        data: { success: false },
        message: '取消归档失败',
      };
    }
  }

  @Post(':id/join')
  async joinGroup(
    @Param('id') id: string,
    @Body() body: { userId: string; role?: 'admin' | 'member' },
  ) {
    try {
      const group = await this.groupsService.joinGroup(
        id,
        body.userId,
        body.role,
      );
      if (group) {
        return {
          code: 200,
          data: group,
          message: '加入成功',
        };
      } else {
        return {
          code: 404,
          data: null,
          message: '群组不存在',
        };
      }
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: '加入失败',
      };
    }
  }

  @Post(':id/members')
  async addGroupMember(
    @Param('id') id: string,
    @Body() body: { userId: string; role?: 'admin' | 'member' },
  ) {
    try {
      const group = await this.groupsService.addGroupMember(
        id,
        body.userId,
        body.role || 'member',
      );
      if (group) {
        return {
          code: 200,
          data: group,
          message: '添加成员成功',
        };
      } else {
        return {
          code: 404,
          data: null,
          message: '群组不存在',
        };
      }
    } catch (error) {
      return {
        code: 400,
        data: null,
        message: error.message || '添加成员失败',
      };
    }
  }

  @Get(':id/members')
  async getGroupMembers(@Param('id') id: string) {
    try {
      const members = await this.groupsService.getGroupMembers(id);
      return {
        code: 200,
        data: members,
        message: '获取成员列表成功',
      };
    } catch (error) {
      console.error('获取成员列表失败:', error);
      return {
        code: 500,
        data: [],
        message: `获取成员列表失败: ${error.message}`,
      };
    }
  }

  @Post(':id/approve-member')
  async approveMember(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ) {
    try {
      const group = await this.groupsService.approveMember(id, body.userId);
      if (group) {
        return {
          code: 200,
          data: group,
          message: '审批成功',
        };
      } else {
        return {
          code: 404,
          data: null,
          message: '群组或成员不存在',
        };
      }
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: '审批失败',
      };
    }
  }

  @Put(':id/status')
  async updateGroupStatus(
    @Param('id') id: string,
    @Body() body: { status: 'pending' | 'approved' | 'rejected' },
  ) {
    try {
      const group = await this.groupsService.updateGroupStatus(id, body.status);
      if (group) {
        return {
          code: 200,
          data: group,
          message: '状态更新成功',
        };
      } else {
        return {
          code: 404,
          data: null,
          message: '群组不存在',
        };
      }
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: '状态更新失败',
      };
    }
  }

  @Put(':id/members/:userId/role')
  async updateMemberRole(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() body: { role: 'admin' | 'member' },
  ) {
    try {
      const group = await this.groupsService.updateMemberRole(
        id,
        userId,
        body.role,
      );
      if (group) {
        return {
          code: 200,
          data: group,
          message: '角色更新成功',
        };
      } else {
        return {
          code: 404,
          data: null,
          message: '群组或成员不存在',
        };
      }
    } catch (error) {
      return {
        code: 400,
        data: null,
        message: error.message || '角色更新失败',
      };
    }
  }

  @Delete(':id/members/:userId')
  async removeGroupMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    try {
      const group = await this.groupsService.removeGroupMember(id, userId);
      if (group) {
        return {
          code: 200,
          data: group,
          message: '移除成员成功',
        };
      } else {
        return {
          code: 404,
          data: null,
          message: '群组不存在',
        };
      }
    } catch (error) {
      return {
        code: 400,
        data: null,
        message: error.message || '移除成员失败',
      };
    }
  }

  @Put(':id/members/:userId/status')
  async updateMemberStatus(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() body: { status: 'approved' | 'rejected' },
  ) {
    try {
      const group = await this.groupsService.updateMemberStatus(
        id,
        userId,
        body.status,
      );
      if (group) {
        return {
          code: 200,
          data: group,
          message: '状态更新成功',
        };
      } else {
        return {
          code: 404,
          data: null,
          message: '群组或成员不存在',
        };
      }
    } catch (error) {
      return {
        code: 400,
        data: null,
        message: error.message || '状态更新失败',
      };
    }
  }
}
