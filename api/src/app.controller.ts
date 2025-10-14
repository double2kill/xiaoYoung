import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  Patch,
  Delete,
  Put,
  HttpCode,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './services/user.service';
import { GroupsService } from './services/groups.service';
import { GroupMembersService } from './services/group-members.service';
import { EventsService } from './services/events.service';
import { DynamicsService } from './services/dynamics.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly groupsService: GroupsService,
    private readonly groupMembersService: GroupMembersService,
    private readonly eventsService: EventsService,
    private readonly dynamicsService: DynamicsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('admin/user-list')
  async getUserList() {
    try {
      const result = await this.userService.findAll(1, 100);
      return {
        code: 200,
        data: result.users.map((user) => ({
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          industry: user.industry,
          profession: user.profession,
          interests: user.interests,
          position: user.position,
          phone: user.phone,
          company: user.company,
          experience: user.experience,
          tags: user.tags,
          status: user.status,
          createTime: user.createTime,
          lastLoginTime: user.lastLoginTime,
          isActive: user.isActive,
        })),
        message: 'success',
      };
    } catch (error) {
      return {
        code: 500,
        data: [],
        message: '获取用户列表失败',
      };
    }
  }

  @Get('admin/users/:id')
  async getUserDetail(@Param('id') id: string) {
    try {
      const user = await this.userService.findOne(id);
      return {
        code: 200,
        data: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          company: user.company,
          position: user.position,
          department: user.department,
          wechatId: user.wechatId,
          industry: user.industry,
          profession: user.profession,
          interests: user.interests,
          experience: user.experience,
          tags: user.tags,
          status: user.status,
          role: user.role,
          isActive: user.isActive,
          loginCount: user.loginCount,
          createTime: user.createTime,
          lastLoginTime: user.lastLoginTime,
          isDeleted: user.isDeleted,
        },
        message: '获取用户详情成功',
      };
    } catch (error) {
      return {
        code: 404,
        data: null,
        message: '用户不存在',
      };
    }
  }

  @Put('admin/users/:id')
  async updateUser(@Param('id') id: string, @Body() updateData: any) {
    try {
      const user = await this.userService.update(id, updateData);
      return {
        code: 200,
        data: user,
        message: '用户信息更新成功',
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: '用户信息更新失败',
      };
    }
  }

  @Get('api/groups')
  async getGroupsForMini() {
    try {
      const groups = await this.groupsService.findAll();
      return {
        code: 200,
        data: groups.map((group) => ({
          id: group._id,
          name: group.name,
          description: group.description,
          groupType: group.groupType,
          status: group.status,
          memberCount: group.members.length,
          members: group.members.map((member: any) => ({
            userId: member.userId,
            role: member.role,
            status: member.status,
            joinedAt: member.joinedAt,
            user:
              member.userId && typeof member.userId === 'object'
                ? {
                    id: member.userId._id,
                    name: member.userId.name,
                    username: member.userId.username,
                    email: member.userId.email,
                    avatar: member.userId.avatar,
                    company: member.userId.company,
                    position: member.userId.position,
                  }
                : null,
          })),
          createdAt: group.createdAt,
          createdBy: group.createdBy,
          createdByInfo:
            group.createdBy &&
            typeof group.createdBy === 'object' &&
            (group.createdBy as any)._id
              ? {
                  id: (group.createdBy as any)._id,
                  name: (group.createdBy as any).name,
                  username: (group.createdBy as any).username,
                  email: (group.createdBy as any).email,
                  avatar: (group.createdBy as any).avatar,
                  company: (group.createdBy as any).company,
                  position: (group.createdBy as any).position,
                }
              : {
                  id: String(group.createdBy),
                  name: '未知用户',
                  username: '',
                  email: '',
                  avatar: '',
                  company: '',
                  position: '',
                },
        })),
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

  @Get('api/groups/:id')
  async getGroupDetailForMini(@Param('id') id: string) {
    try {
      const group = await this.groupsService.findById(id);
      if (group) {
        return {
          code: 200,
          data: {
            id: group._id,
            name: group.name,
            description: group.description,
            groupType: group.groupType,
            status: group.status,
            memberCount: group.members.length,
            members: await Promise.all(
              group.members.map(async (member: any) => {
                // 根据 userId 查找用户信息
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
                  userId: member.userId,
                  role: member.role,
                  status: member.status,
                  joinedAt: member.joinedAt,
                  userInfo,
                };
              }),
            ),
            createdAt: group.createdAt,
            createdBy: group.createdBy,
            createdByInfo:
              group.createdBy &&
              typeof group.createdBy === 'object' &&
              (group.createdBy as any)._id
                ? {
                    id: (group.createdBy as any)._id,
                    name: (group.createdBy as any).name,
                    username: (group.createdBy as any).username,
                    email: (group.createdBy as any).email,
                    avatar: (group.createdBy as any).avatar,
                    company: (group.createdBy as any).company,
                    position: (group.createdBy as any).position,
                  }
                : {
                    id: String(group.createdBy),
                    name: '未知用户',
                    username: '',
                    email: '',
                    avatar: '',
                    company: '',
                    position: '',
                  },
          },
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

  @Post('api/groups/:id/join')
  @HttpCode(200)
  async joinGroupForMini(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ) {
    try {
      // 验证参数
      if (!body.userId) {
        return {
          code: 400,
          data: { success: false },
          message: '用户ID不能为空',
        };
      }

      // 验证圈子是否存在
      const group = await this.groupsService.findById(id);
      if (!group) {
        return {
          code: 404,
          data: { success: false },
          message: '群组不存在',
        };
      }

      // 检查用户是否已经是成员
      const existingMember = group.members.find(
        (member) => member.userId.toString() === body.userId,
      );
      if (existingMember) {
        return {
          code: 400,
          data: { success: false },
          message: '您已经是该群组的成员',
        };
      }

      // 加入群组
      await this.groupsService.joinGroup(id, body.userId);
      return {
        code: 200,
        data: { success: true },
        message: '加入成功',
      };
    } catch (error) {
      console.error('加入群组失败:', error);
      return {
        code: 500,
        data: { success: false },
        message: '加入失败',
      };
    }
  }

  @Get('api/groups/:id/events')
  async getGroupEventsForMini(@Param('id') id: string) {
    try {
      const events = await this.eventsService.findAll(id, 'approved');
      return {
        code: 200,
        data: events.map((event: any) => ({
          id: event._id,
          title: event.title,
          description: event.description,
          location: event.location,
          startTime: event.startTime,
          endTime: event.endTime,
          maxParticipants: event.maxParticipants,
          participants: event.participants.length,
          status: event.status,
          createdAt: event.createdAt,
        })),
        message: '获取活动列表成功',
      };
    } catch (error) {
      return {
        code: 500,
        data: [],
        message: '获取活动列表失败',
      };
    }
  }

  @Get('api/groups/:id/dynamics')
  async getGroupDynamicsForMini(@Param('id') id: string) {
    try {
      const dynamics = await this.dynamicsService.findAll(
        id,
        undefined,
        'published',
      );
      return {
        code: 200,
        data: dynamics.map((dynamic: any) => ({
          id: dynamic._id,
          content: dynamic.content,
          authorName: dynamic.authorId?.name || '未知用户',
          authorAvatar: dynamic.authorId?.avatar || '',
          images: dynamic.images || [],
          likes: dynamic.likes,
          comments: dynamic.comments,
          createdAt: dynamic.createdAt,
        })),
        message: '获取动态列表成功',
      };
    } catch (error) {
      return {
        code: 500,
        data: [],
        message: '获取动态列表失败',
      };
    }
  }

  @Get('api/user-list')
  getUserListApi() {
    return {
      code: 200,
      data: [
        {
          id: 1,
          username: 'zhangsan',
          name: '张三',
          avatar: '',
          company: '腾讯科技',
          position: '高级前端工程师',
          status: 'active',
        },
        {
          id: 2,
          username: 'lisi',
          name: '李四',
          avatar: '',
          company: '招商银行',
          position: '投资经理',
          status: 'active',
        },
        {
          id: 3,
          username: 'wangwu',
          name: '王五',
          avatar: '',
          company: '北京大学',
          position: '高级讲师',
          status: 'active',
        },
        {
          id: 4,
          username: 'zhaoliu',
          name: '赵六',
          avatar: '',
          company: '阿里巴巴',
          position: '产品经理',
          status: 'active',
        },
        {
          id: 5,
          username: 'chenqi',
          name: '陈七',
          avatar: '',
          company: '字节跳动',
          position: 'UI设计师',
          status: 'active',
        },
        {
          id: 6,
          username: 'sunba',
          name: '孙八',
          avatar: '',
          company: '美团',
          position: '运营专员',
          status: 'active',
        },
      ],
      message: '获取用户列表成功',
    };
  }

  @Post('api/user/login')
  @HttpCode(200)
  loginUser(@Body() loginData: { username: string }) {
    const { username } = loginData;

    if (!username || !username.trim()) {
      return {
        code: 400,
        data: null,
        message: '用户名不能为空',
      };
    }

    const mockUsers = [
      { id: 1, username: 'zhangsan', name: '张三' },
      { id: 2, username: 'lisi', name: '李四' },
      { id: 3, username: 'wangwu', name: '王五' },
      { id: 4, username: 'zhaoliu', name: '赵六' },
      { id: 5, username: 'chenqi', name: '陈七' },
      { id: 6, username: 'sunba', name: '孙八' },
    ];

    const user = mockUsers.find((u) => u.username === username.trim());

    if (user) {
      return {
        code: 200,
        data: {
          id: user.id,
          username: user.username,
          name: user.name,
          token: `mock_token_${user.id}_${Date.now()}`,
          loginTime: new Date().toISOString(),
        },
        message: '登录成功',
      };
    } else {
      return {
        code: 200,
        data: {
          id: Date.now(),
          username: username.trim(),
          name: username.trim(),
          token: `mock_token_${Date.now()}`,
          loginTime: new Date().toISOString(),
        },
        message: '登录成功',
      };
    }
  }

  @Get('admin/events')
  async getAdminEvents(
    @Query('groupId') groupId?: string,
    @Query('status') status?: string,
  ) {
    try {
      const events = await this.eventsService.findAll(groupId, status);
      return {
        code: 200,
        data: events,
        message: '获取活动列表成功',
      };
    } catch (error) {
      return {
        code: 500,
        data: [],
        message: '获取活动列表失败',
      };
    }
  }

  @Get('admin/events/:id')
  async getAdminEventDetail(@Param('id') id: string) {
    try {
      const event = await this.eventsService.findOne(id);
      return {
        code: 200,
        data: event,
        message: '获取活动详情成功',
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: '获取活动详情失败',
      };
    }
  }

  @Post('admin/events')
  async createAdminEvent(@Body() createEventDto: any) {
    try {
      console.log('创建活动数据:', createEventDto);
      const event = await this.eventsService.create(createEventDto);
      return {
        code: 200,
        data: event,
        message: '创建活动成功',
      };
    } catch (error) {
      console.error('创建活动失败:', error);
      return {
        code: 500,
        data: null,
        message: `创建活动失败: ${error.message || error}`,
      };
    }
  }

  @Patch('admin/events/:id')
  async updateAdminEvent(@Param('id') id: string, @Body() updateEventDto: any) {
    try {
      const event = await this.eventsService.update(id, updateEventDto);
      return {
        code: 200,
        data: event,
        message: '更新活动成功',
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: '更新活动失败',
      };
    }
  }

  @Delete('admin/events/:id')
  async deleteAdminEvent(@Param('id') id: string) {
    try {
      await this.eventsService.remove(id);
      return {
        code: 200,
        data: null,
        message: '归档活动成功',
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: '归档活动失败',
      };
    }
  }

  @Post('admin/events/:id/join')
  async joinAdminEvent(@Param('id') id: string, @Body() joinEventDto: any) {
    try {
      const event = await this.eventsService.joinEvent(id, joinEventDto);
      return {
        code: 200,
        data: event,
        message: '参与活动成功',
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: '参与活动失败',
      };
    }
  }

  @Patch('admin/events/:eventId/participants/:userId/status')
  async updateAdminParticipantStatus(
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
    @Body('status') status: string,
  ) {
    try {
      const event = await this.eventsService.updateParticipantStatus(
        eventId,
        userId,
        status,
      );
      return {
        code: 200,
        data: event,
        message: '更新参与者状态成功',
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: '更新参与者状态失败',
      };
    }
  }

  @Delete('admin/events/:eventId/participants/:userId')
  async removeAdminParticipant(
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
  ) {
    try {
      const event = await this.eventsService.removeParticipant(eventId, userId);
      return {
        code: 200,
        data: event,
        message: '移除参与者成功',
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: '移除参与者失败',
      };
    }
  }

  @Get('admin/events/user/:userId')
  async getAdminEventsByUser(@Param('userId') userId: string) {
    try {
      const events = await this.eventsService.getEventsByUser(userId);
      return {
        code: 200,
        data: events,
        message: '获取用户活动成功',
      };
    } catch (error) {
      return {
        code: 500,
        data: [],
        message: '获取用户活动失败',
      };
    }
  }
}
