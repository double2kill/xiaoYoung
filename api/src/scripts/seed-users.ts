import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../services/user.service';

const userData = [
  {
    username: 'zhangsan',
    name: '张三',
    email: 'zhangsan@example.com',
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
    isActive: true,
  },
  {
    username: 'lisi',
    name: '李四',
    email: 'lisi@example.com',
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
    isActive: false,
  },
  {
    username: 'wangwu',
    name: '王五',
    email: 'wangwu@example.com',
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
    isActive: true,
  },
  {
    username: 'zhaoliu',
    name: '赵六',
    email: 'zhaoliu@example.com',
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
    isActive: true,
  },
  {
    username: 'chenqi',
    name: '陈七',
    email: 'chenqi@example.com',
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
    isActive: true,
  },
  {
    username: 'sunba',
    name: '孙八',
    email: 'sunba@example.com',
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
    isActive: false,
  },
];

async function seedUsers() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);

  try {
    console.log('开始插入用户数据...');

    for (const user of userData) {
      try {
        await userService.create(user);
        console.log(`✓ 用户 ${user.name} (${user.username}) 创建成功`);
      } catch (error) {
        if (error.message.includes('用户邮箱已存在')) {
          console.log(`⚠ 用户 ${user.name} (${user.username}) 已存在，跳过`);
        } else {
          console.error(
            `✗ 用户 ${user.name} (${user.username}) 创建失败:`,
            error.message,
          );
        }
      }
    }

    console.log('用户数据插入完成！');
  } catch (error) {
    console.error('插入用户数据时发生错误:', error);
  } finally {
    await app.close();
  }
}

seedUsers();
