import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './services/user.service';
import { CommunityService } from './services/community.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly communityService: CommunityService,
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

  @Get('api/community')
  async getCommunityForMini() {
    try {
      const communities = await this.communityService.findAll();
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

  @Get('api/community/:id')
  async getCommunityDetailForMini(@Param('id') id: string) {
    try {
      const community = await this.communityService.findById(id);
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

  @Post('api/community/:id/join')
  async joinCommunityForMini(@Param('id') id: string) {
    try {
      const community = await this.communityService.findById(id);
      if (community) {
        await this.communityService.join(id);
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

  @Get('api/user-list')
  getUserListApi() {
    return {
      code: 200,
      data: [
        {
          id: 1,
          username: 'zhangsan',
          name: '张三',
          industry: '互联网',
          profession: '软件工程',
          interests: ['编程', '篮球', '音乐'],
          position: '高级前端工程师',
          phone: '13800138001',
          company: '腾讯科技',
          experience: '5年前端开发经验，精通React、Vue等框架',
          tags: ['技术专家', '团队负责人'],
          status: 'active',
          createTime: '2024-01-01',
          lastLoginTime: '2024-01-22 10:30:00',
        },
        {
          id: 2,
          username: 'lisi',
          name: '李四',
          industry: '金融',
          profession: '金融学',
          interests: ['投资', '阅读', '旅行'],
          position: '投资经理',
          phone: '13800138002',
          company: '招商银行',
          experience: '3年投资管理经验，专注股票和债券投资',
          tags: ['CFA持证人', '投资专家'],
          status: 'inactive',
          createTime: '2024-01-02',
          lastLoginTime: '2024-01-20 15:45:00',
        },
        {
          id: 3,
          username: 'wangwu',
          name: '王五',
          industry: '教育',
          profession: '教育学',
          interests: ['教学', '心理学', '摄影'],
          position: '高级讲师',
          phone: '13800138003',
          company: '北京大学',
          experience: '8年教学经验，发表多篇教育研究论文',
          tags: ['教授', '教育专家'],
          status: 'active',
          createTime: '2024-01-03',
          lastLoginTime: '2024-01-22 09:15:00',
        },
        {
          id: 4,
          username: 'zhaoliu',
          name: '赵六',
          industry: '医疗',
          profession: '临床医学',
          interests: ['医学研究', '健身', '烹饪'],
          position: '主治医师',
          phone: '13800138004',
          company: '北京协和医院',
          experience: '6年临床经验，擅长心血管疾病治疗',
          tags: ['医学博士', '专家医师'],
          status: 'active',
          createTime: '2024-01-04',
          lastLoginTime: '2024-01-21 14:20:00',
        },
        {
          id: 5,
          username: 'chenqi',
          name: '陈七',
          industry: '设计',
          profession: '视觉传达',
          interests: ['UI设计', '摄影', '旅行'],
          position: '高级UI设计师',
          phone: '13800138005',
          company: '字节跳动',
          experience: '4年UI设计经验，专注移动端产品设计',
          tags: ['设计专家', '创意总监'],
          status: 'active',
          createTime: '2024-01-05',
          lastLoginTime: '2024-01-22 11:00:00',
        },
        {
          id: 6,
          username: 'sunba',
          name: '孙八',
          industry: '市场营销',
          profession: '市场营销',
          interests: ['品牌策划', '数据分析', '健身'],
          position: '市场总监',
          phone: '13800138006',
          company: '阿里巴巴',
          experience: '6年市场营销经验，擅长品牌推广和用户增长',
          tags: ['营销专家', '增长黑客'],
          status: 'inactive',
          createTime: '2024-01-06',
          lastLoginTime: '2024-01-19 16:30:00',
        },
      ],
      message: '获取用户列表成功',
    };
  }

  @Post('api/user/login')
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
}
