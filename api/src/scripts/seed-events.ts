import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { EventsService } from '../services/events.service';
import { UserService } from '../services/user.service';
import { GroupsService } from '../services/groups.service';

const eventData = [
  {
    title: '周末户外徒步活动',
    description:
      '邀请大家一起去郊外徒步，呼吸新鲜空气，锻炼身体。路线适合初学者，全程约8公里。',
    location: '香山公园',
    startTime: new Date('2025-10-18 08:00:00'),
    endTime: new Date('2025-10-18 16:00:00'),
    deadline: new Date('2025-10-17 18:00:00'),
    maxParticipants: 20,
    requirements: '请穿运动鞋，自备水和午餐',
    safetyNotice: '注意安全，不要独自离队',
    feeInfo: '免费活动，AA制午餐',
    tags: ['户外', '运动', '健康'],
    status: 'approved',
  },
  {
    title: '技术分享会：前端新技术探讨',
    description:
      '本期主题：React 19 新特性解析，欢迎对前端开发感兴趣的朋友参加。会有实战演示和Q&A环节。',
    location: '中关村创业大街咖啡厅',
    startTime: new Date('2025-10-20 14:00:00'),
    endTime: new Date('2025-10-20 17:00:00'),
    deadline: new Date('2025-10-19 20:00:00'),
    maxParticipants: 30,
    requirements: '建议带笔记本电脑',
    feeInfo: '免费参加，提供茶点',
    tags: ['技术', '前端', '学习'],
    status: 'approved',
  },
  {
    title: '读书会：《人类简史》共读',
    description:
      '一起阅读尤瓦尔·赫拉利的经典作品，交流心得体会。本次讨论第3-5章内容。',
    location: '朝阳图书馆二楼活动室',
    startTime: new Date('2025-10-22 19:00:00'),
    endTime: new Date('2025-10-22 21:00:00'),
    deadline: new Date('2025-10-21 12:00:00'),
    maxParticipants: 15,
    requirements: '请提前阅读相关章节',
    feeInfo: '免费活动',
    tags: ['读书', '文化', '交流'],
    status: 'approved',
  },
  {
    title: '周末烘焙教学：手工面包制作',
    description:
      '专业烘焙师教你制作健康美味的手工面包，包括揉面、发酵、烘烤全流程。每位参与者可带走自己的作品。',
    location: '美食工作室（国贸店）',
    startTime: new Date('2025-10-25 10:00:00'),
    endTime: new Date('2025-10-25 13:00:00'),
    deadline: new Date('2025-10-23 18:00:00'),
    maxParticipants: 12,
    requirements: '请穿着轻便服装',
    feeInfo: '材料费80元/人',
    tags: ['烘焙', '美食', '手工'],
    status: 'approved',
  },
  {
    title: '摄影外拍：秋日银杏打卡',
    description:
      '秋天是拍摄银杏的最佳季节，邀请摄影爱好者一起去地坛公园拍摄金色银杏。会有专业摄影师现场指导。',
    location: '地坛公园',
    startTime: new Date('2025-10-26 14:00:00'),
    endTime: new Date('2025-10-26 17:00:00'),
    deadline: new Date('2025-10-25 12:00:00'),
    maxParticipants: 25,
    requirements: '自备相机或手机',
    safetyNotice: '注意保管好摄影器材',
    feeInfo: '免费活动，门票自理',
    tags: ['摄影', '户外', '艺术'],
    status: 'approved',
  },
  {
    title: '投资理财讲座：资产配置策略',
    description:
      '资深理财师分享2025年投资趋势和资产配置建议，适合理财初学者和进阶者。',
    location: '金融街会议中心',
    startTime: new Date('2025-10-28 15:00:00'),
    endTime: new Date('2025-10-28 17:30:00'),
    deadline: new Date('2025-10-27 18:00:00'),
    maxParticipants: 50,
    requirements: '建议带笔记本',
    feeInfo: '免费讲座',
    tags: ['金融', '理财', '投资'],
    status: 'approved',
  },
  {
    title: '瑜伽体验课：初学者专场',
    description:
      '专业瑜伽教练带领大家体验基础瑜伽动作，释放压力，舒展身心。适合零基础学员。',
    location: '健身中心瑜伽室',
    startTime: new Date('2025-10-29 18:30:00'),
    endTime: new Date('2025-10-29 20:00:00'),
    deadline: new Date('2025-10-28 12:00:00'),
    maxParticipants: 20,
    requirements: '请穿着运动服，自备瑜伽垫',
    feeInfo: '体验价30元/人',
    tags: ['瑜伽', '健身', '养生'],
    status: 'approved',
  },
  {
    title: '创业经验分享会',
    description:
      '邀请3位成功创业者分享他们的创业故事、经验教训和实战心得。设有互动交流环节。',
    location: '创业孵化基地路演厅',
    startTime: new Date('2025-11-01 14:00:00'),
    endTime: new Date('2025-11-01 17:00:00'),
    deadline: new Date('2025-10-31 18:00:00'),
    maxParticipants: 60,
    requirements: '可准备问题提前提交',
    feeInfo: '免费参加',
    tags: ['创业', '商业', '分享'],
    status: 'approved',
  },
  {
    title: '周末电影沙龙：经典影片赏析',
    description: '本期观影：《肖申克的救赎》，观影后进行深度讨论和影评交流。',
    location: '艺术影院小厅',
    startTime: new Date('2025-11-02 19:00:00'),
    endTime: new Date('2025-11-02 22:00:00'),
    deadline: new Date('2025-11-01 18:00:00'),
    maxParticipants: 30,
    feeInfo: '门票40元/人',
    tags: ['电影', '文化', '艺术'],
    status: 'approved',
  },
  {
    title: '亲子活动：儿童科学实验',
    description:
      '有趣的科学小实验，激发孩子对科学的兴趣。适合6-12岁儿童及家长参与。',
    location: '科技馆实验室',
    startTime: new Date('2025-11-03 10:00:00'),
    endTime: new Date('2025-11-03 12:00:00'),
    deadline: new Date('2025-11-02 12:00:00'),
    maxParticipants: 15,
    requirements: '需家长陪同',
    safetyNotice: '实验过程请遵守安全规定',
    feeInfo: '材料费50元/组（一大一小）',
    tags: ['亲子', '科学', '教育'],
    status: 'pending',
  },
];

async function seedEvents() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const eventsService = app.get(EventsService);
  const userService = app.get(UserService);
  const groupsService = app.get(GroupsService);

  try {
    console.log('开始处理活动数据...');

    const usersResult = await userService.findAll();
    if (usersResult.users.length === 0) {
      console.error('没有找到用户数据，请先运行用户种子脚本');
      return;
    }

    const groupsResult = await groupsService.findAll();
    if (groupsResult.length === 0) {
      console.error('没有找到圈子数据，请先运行圈子种子脚本');
      return;
    }

    console.log('查找"生活实验站"圈子...');
    const targetGroup = groupsResult.find((g: any) => g.name === '生活实验站');

    if (targetGroup) {
      console.log(`找到圈子：${targetGroup.name}，ID: ${targetGroup._id}`);
      console.log('注意：由于没有直接删除方法，活动会被标记为已删除状态');
    } else {
      console.log('未找到"生活实验站"圈子');
    }

    const users = usersResult.users;
    const activeGroups = groupsResult.filter(
      (g: any) => g.name !== '生活实验站',
    );

    if (activeGroups.length === 0) {
      console.error('没有可用的圈子');
      return;
    }

    console.log('开始插入新的活动数据...');

    for (let i = 0; i < eventData.length; i++) {
      const event = eventData[i];

      const randomUserIndex = Math.floor(Math.random() * users.length);
      const randomGroupIndex = Math.floor(Math.random() * activeGroups.length);

      try {
        const eventPayload: any = {
          ...event,
          groupId: (activeGroups[randomGroupIndex] as any)._id.toString(),
          createdBy: (users[randomUserIndex] as any)._id.toString(),
          participants: [],
        };

        await eventsService.create(eventPayload);
        console.log(`✓ 活动 ${i + 1}: ${event.title} 创建成功`);
      } catch (error: any) {
        console.error(
          `✗ 活动 ${i + 1}: ${event.title} 创建失败:`,
          error.message,
        );
      }
    }

    console.log('活动数据处理完成！');
  } catch (error) {
    console.error('处理活动数据时发生错误:', error);
  } finally {
    await app.close();
  }
}

seedEvents();
