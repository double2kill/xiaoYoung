import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('admin/user-list')
  getUserList() {
    return {
      code: 200,
      data: [
        {
          id: 1,
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
        },
        {
          id: 2,
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
        },
        {
          id: 3,
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
        },
        {
          id: 4,
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
        },
      ],
      message: 'success',
    };
  }

  @Get('api/community')
  getCommunity() {
    return {
      code: 200,
      data: [
        {
          id: 1,
          name: '经济学院校友分会(筹)',
          memberCount: 175,
          rating: [true, true, false, false, false],
          contactName: '程远蝶',
          contactPhone: '199****3107',
          description: '经济学院校友交流平台，促进校友间的联系与合作',
          createTime: '2023-01-15',
          lastActiveTime: '2024-01-20',
        },
        {
          id: 2,
          name: '计算机学院技术交流群',
          memberCount: 320,
          rating: [true, true, true, true, false],
          contactName: '李明',
          contactPhone: '138****5678',
          description: '计算机学院校友技术交流群，分享最新技术动态和项目经验',
          createTime: '2023-03-10',
          lastActiveTime: '2024-01-22',
        },
        {
          id: 3,
          name: '创业校友联盟',
          memberCount: 89,
          rating: [true, true, true, false, false],
          contactName: '王强',
          contactPhone: '186****9012',
          description: '创业校友交流平台，提供创业指导和资源对接',
          createTime: '2023-05-20',
          lastActiveTime: '2024-01-18',
        },
        {
          id: 4,
          name: '艺术设计校友会',
          memberCount: 156,
          rating: [true, true, true, true, true],
          contactName: '张美',
          contactPhone: '159****3456',
          description: '艺术设计专业校友交流群，分享设计作品和行业资讯',
          createTime: '2023-02-28',
          lastActiveTime: '2024-01-21',
        },
      ],
      message: 'success',
    };
  }
}
