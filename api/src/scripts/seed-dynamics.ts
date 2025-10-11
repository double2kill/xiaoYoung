import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DynamicsService } from '../services/dynamics.service';
import { UserService } from '../services/user.service';
import { GroupsService } from '../services/groups.service';

const dynamicContents = [
  {
    content:
      '刚参加了一场技术分享会，了解到了最新的前端开发趋势。React Server Components真的很有潜力！大家有没有在项目中尝试过？',
    images: [],
  },
  {
    content:
      '今天终于完成了团队的季度目标！感谢所有成员的辛勤付出，接下来继续加油💪',
    images: [],
  },
  {
    content:
      '分享一个提高工作效率的小技巧：使用番茄工作法，25分钟专注工作+5分钟休息，效率提升明显！',
    images: [],
  },
  {
    content:
      '周末去了趟郊外徒步，呼吸新鲜空气真的太舒服了！工作再忙也要记得劳逸结合。',
    images: [],
  },
  {
    content:
      '最近在学习TypeScript，发现类型系统真的能帮助避免很多bug。推荐大家在项目中使用！',
    images: [],
  },
  {
    content:
      '分享一个最近读的好书：《深度工作》，讲述如何在碎片化的时代保持专注力，强烈推荐！',
    images: [],
  },
  {
    content:
      '团队今天举办了头脑风暴会议，碰撞出了很多新想法。团队协作真的很重要！',
    images: [],
  },
  {
    content:
      '参加了线下技术沙龙，认识了很多同行，收获满满。建议大家多参加这类活动，扩展人脉。',
    images: [],
  },
  {
    content:
      '今天优化了一个困扰很久的性能问题，代码执行效率提升了50%！解决问题的感觉真好😊',
    images: [],
  },
  {
    content:
      '分享一个投资心得：不要把鸡蛋放在同一个篮子里，分散投资才能降低风险。',
    images: [],
  },
  {
    content:
      '最近在学习新的设计工具Figma，功能强大而且协作方便，设计师们可以试试！',
    images: [],
  },
  {
    content:
      '今天完成了一个重要项目的交付，客户非常满意。坚持和努力总会有回报！',
    images: [],
  },
  {
    content:
      '分享一个健康小贴士：久坐族记得每小时起来活动一下，保护好自己的腰椎和颈椎。',
    images: [],
  },
  {
    content:
      '参加了公司的培训课程，学到了很多沟通技巧。软技能和硬技能同样重要！',
    images: [],
  },
  {
    content:
      '周末尝试了新的烘焙配方，第一次做面包就成功了！生活需要一些小乐趣🍞',
    images: [],
  },
  {
    content:
      '最近在使用AI工具辅助工作，效率提升了不少。拥抱新技术才能不被时代淘汰。',
    images: [],
  },
  {
    content: '团队建设活动圆满结束，大家玩得很开心。良好的团队氛围真的很重要！',
    images: [],
  },
  {
    content:
      '分享一个时间管理方法：优先处理重要且紧急的事情，然后是重要但不紧急的，以此类推。',
    images: [],
  },
  {
    content:
      '今天收到了用户的感谢信，说我们的产品帮助他们解决了大问题。这就是做产品的意义所在！',
    images: [],
  },
  {
    content:
      '参加了行业峰会，看到了很多创新产品和解决方案。保持学习和好奇心很重要！',
    images: [],
  },
];

async function seedDynamics() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dynamicsService = app.get(DynamicsService);
  const userService = app.get(UserService);
  const groupsService = app.get(GroupsService);

  try {
    console.log('开始插入动态数据...');

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

    const users = usersResult.users;
    const groups = groupsResult;

    for (let i = 0; i < dynamicContents.length; i++) {
      const dynamicData = dynamicContents[i];

      const randomUserIndex = Math.floor(Math.random() * users.length);
      const randomGroupIndex = Math.floor(Math.random() * groups.length);

      const shouldHaveGroup = Math.random() > 0.3;

      const likes = Math.floor(Math.random() * 50);
      const comments = Math.floor(Math.random() * 20);
      const shares = Math.floor(Math.random() * 10);

      try {
        const dynamicPayload: any = {
          content: dynamicData.content,
          authorId: (users[randomUserIndex] as any)._id.toString(),
          groupId: shouldHaveGroup
            ? (groups[randomGroupIndex] as any)._id.toString()
            : undefined,
          images: dynamicData.images,
          likes,
          comments,
          shares,
          likedBy: [],
          status: 'published',
        };

        await dynamicsService.create(dynamicPayload);
        console.log(`✓ 动态 ${i + 1} 创建成功`);
      } catch (error: any) {
        console.error(`✗ 动态 ${i + 1} 创建失败:`, error.message);
      }
    }

    console.log('动态数据插入完成！');
  } catch (error) {
    console.error('插入动态数据时发生错误:', error);
  } finally {
    await app.close();
  }
}

seedDynamics();
