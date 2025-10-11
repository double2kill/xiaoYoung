import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { GroupsService } from '../services/groups.service';
import { UserService } from '../services/user.service';

const groupData = [
  {
    name: '技术交流圈',
    description: '专注于技术分享、编程讨论和职业发展的技术圈子',
    groupType: '技术',
    status: 'approved',
  },
  {
    name: '投资理财圈',
    description: '分享投资经验、理财技巧和金融市场动态',
    groupType: '金融',
    status: 'approved',
  },
  {
    name: '教育学习圈',
    description: '教育工作者和学习爱好者的交流平台',
    groupType: '教育',
    status: 'approved',
  },
  {
    name: '医疗健康圈',
    description: '医疗专业人士和健康生活爱好者的圈子',
    groupType: '医疗',
    status: 'approved',
  },
  {
    name: '设计创意圈',
    description: '设计师和创意工作者的灵感分享平台',
    groupType: '设计',
    status: 'approved',
  },
  {
    name: '市场营销圈',
    description: '营销专业人士的交流和学习平台',
    groupType: '营销',
    status: 'approved',
  },
  {
    name: '创业交流圈',
    description: '创业者分享经验、寻找合作伙伴的圈子',
    groupType: '创业',
    status: 'pending',
  },
  {
    name: '生活分享圈',
    description: '分享生活点滴、兴趣爱好和生活技巧',
    groupType: '生活',
    status: 'approved',
  },
];

async function seedGroups() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const groupsService = app.get(GroupsService);
  const userService = app.get(UserService);

  try {
    console.log('开始插入圈子数据...');

    // 获取第一个用户作为创建者
    const usersResult = await userService.findAll();
    if (usersResult.users.length === 0) {
      console.error('没有找到用户数据，请先运行用户种子脚本');
      return;
    }

    const creatorId = usersResult.users[0]._id;

    for (const group of groupData) {
      try {
        const groupDataWithCreator = {
          ...group,
          createdBy: creatorId,
          members: [
            {
              userId: creatorId,
              role: 'admin',
              status: 'approved',
              joinedAt: new Date(),
            },
          ],
        };

        await groupsService.create(groupDataWithCreator);
        console.log(`✓ 圈子 ${group.name} 创建成功`);
      } catch (error) {
        if (error.message.includes('圈子名称已存在')) {
          console.log(`⚠ 圈子 ${group.name} 已存在，跳过`);
        } else {
          console.error(`✗ 圈子 ${group.name} 创建失败:`, error.message);
        }
      }
    }

    console.log('圈子数据插入完成！');
  } catch (error) {
    console.error('插入圈子数据时发生错误:', error);
  } finally {
    await app.close();
  }
}

seedGroups();
