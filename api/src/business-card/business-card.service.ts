import { Injectable } from '@nestjs/common';

export interface BusinessCard {
  id: number;
  userId: number;
  industry: string;
  profession: string;
  interests: string;
  position: string;
  company?: string;
  email?: string;
  phone?: string;
  wechat?: string;
  introduction?: string;
  avatarUrl?: string;
  nickName?: string;
  createTime: string;
  updateTime: string;
}

@Injectable()
export class BusinessCardService {
  public businessCards: BusinessCard[] = [
    {
      id: 1,
      userId: 1,
      industry: '互联网/IT',
      profession: '软件工程师',
      interests: '编程,篮球,音乐',
      position: '高级前端工程师',
      company: '腾讯科技',
      email: 'zhangsan@tencent.com',
      phone: '13800138001',
      wechat: 'zhangsan_dev',
      introduction: '5年前端开发经验，精通React、Vue等框架，热爱技术分享',
      avatarUrl: 'https://via.placeholder.com/100',
      nickName: '张三',
      createTime: '2024-01-01T00:00:00.000Z',
      updateTime: '2024-01-22T10:30:00.000Z',
    },
    {
      id: 2,
      userId: 2,
      industry: '金融/投资',
      profession: '投资经理',
      interests: '投资,阅读,旅行',
      position: '投资经理',
      company: '招商银行',
      email: 'lisi@cmb.com',
      phone: '13800138002',
      wechat: 'lisi_invest',
      introduction: '3年投资管理经验，专注股票和债券投资，CFA持证人',
      avatarUrl: 'https://via.placeholder.com/100',
      nickName: '李四',
      createTime: '2024-01-02T00:00:00.000Z',
      updateTime: '2024-01-20T15:45:00.000Z',
    },
    {
      id: 3,
      userId: 3,
      industry: '教育/培训',
      profession: '教师',
      interests: '教学,心理学,摄影',
      position: '高级讲师',
      company: '北京大学',
      email: 'wangwu@pku.edu.cn',
      phone: '13800138003',
      wechat: 'wangwu_edu',
      introduction: '8年教学经验，发表多篇教育研究论文，教育心理学专家',
      avatarUrl: 'https://via.placeholder.com/100',
      nickName: '王五',
      createTime: '2024-01-03T00:00:00.000Z',
      updateTime: '2024-01-22T09:15:00.000Z',
    },
    {
      id: 4,
      userId: 4,
      industry: '医疗/健康',
      profession: '医生',
      interests: '医学研究,健身,烹饪',
      position: '主治医师',
      company: '北京协和医院',
      email: 'zhaoliu@pumch.cn',
      phone: '13800138004',
      wechat: 'zhaoliu_med',
      introduction: '6年临床经验，擅长心血管疾病治疗，医学博士',
      avatarUrl: 'https://via.placeholder.com/100',
      nickName: '赵六',
      createTime: '2024-01-04T00:00:00.000Z',
      updateTime: '2024-01-21T14:20:00.000Z',
    },
    {
      id: 5,
      userId: 5,
      industry: '互联网/IT',
      profession: '设计师',
      interests: 'UI设计,摄影,旅行',
      position: '高级UI设计师',
      company: '字节跳动',
      email: 'chenqi@bytedance.com',
      phone: '13800138005',
      wechat: 'chenqi_design',
      introduction: '4年UI设计经验，专注移动端产品设计，创意总监',
      avatarUrl: 'https://via.placeholder.com/100',
      nickName: '陈七',
      createTime: '2024-01-05T00:00:00.000Z',
      updateTime: '2024-01-22T11:00:00.000Z',
    },
    {
      id: 6,
      userId: 6,
      industry: '零售/电商',
      profession: '运营',
      interests: '品牌策划,数据分析,健身',
      position: '市场总监',
      company: '阿里巴巴',
      email: 'sunba@alibaba.com',
      phone: '13800138006',
      wechat: 'sunba_marketing',
      introduction: '6年市场营销经验，擅长品牌推广和用户增长',
      avatarUrl: 'https://via.placeholder.com/100',
      nickName: '孙八',
      createTime: '2024-01-06T00:00:00.000Z',
      updateTime: '2024-01-19T16:30:00.000Z',
    },
  ];

  getBusinessCard(userId: number): BusinessCard | null {
    const card = this.businessCards.find((card) => card.userId === userId);
    if (card) {
      return card;
    }

    return this.getMockBusinessCard(userId);
  }

  getMockBusinessCard(userId: number): BusinessCard {
    const mockUsers = [
      { id: 1, username: 'zhangsan', name: '张三' },
      { id: 2, username: 'lisi', name: '李四' },
      { id: 3, username: 'wangwu', name: '王五' },
      { id: 4, username: 'zhaoliu', name: '赵六' },
      { id: 5, username: 'chenqi', name: '陈七' },
      { id: 6, username: 'sunba', name: '孙八' },
    ];

    const user = mockUsers.find((u) => u.id === userId) || {
      id: userId,
      username: `user${userId}`,
      name: `用户${userId}`,
    };

    const mockIndustries = [
      '互联网/IT',
      '金融/投资',
      '教育/培训',
      '医疗/健康',
      '房地产/建筑',
      '制造业',
    ];
    const mockProfessions = [
      '软件工程师',
      '产品经理',
      '设计师',
      '运营',
      '销售',
      '市场',
    ];
    const mockPositions = ['实习生', '专员', '主管', '经理', '总监'];
    const mockCompanies = [
      '腾讯科技',
      '阿里巴巴',
      '字节跳动',
      '百度',
      '京东',
      '美团',
    ];
    const mockInterests = [
      '编程,篮球,音乐',
      '投资,阅读,旅行',
      '教学,心理学,摄影',
      '医学研究,健身,烹饪',
      'UI设计,摄影,旅行',
      '品牌策划,数据分析,健身',
    ];

    const randomIndex = userId % 6;

    return {
      id: userId,
      userId: userId,
      industry: mockIndustries[randomIndex],
      profession: mockProfessions[randomIndex],
      interests: mockInterests[randomIndex],
      position: mockPositions[randomIndex % mockPositions.length],
      company: mockCompanies[randomIndex],
      email: `${user.username}@example.com`,
      phone: `138${String(userId).padStart(8, '0')}`,
      wechat: `${user.username}_wx`,
      introduction: `这是${user.name}的个人简介，拥有丰富的行业经验，专注于${mockProfessions[randomIndex]}领域。`,
      avatarUrl: `https://via.placeholder.com/100?text=${encodeURIComponent(user.name)}`,
      nickName: user.name,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    };
  }

  createBusinessCard(businessCardDto: any): BusinessCard {
    const newCard: BusinessCard = {
      id: this.businessCards.length + 1,
      userId: businessCardDto.userId,
      industry: businessCardDto.industry,
      profession: businessCardDto.profession,
      interests: businessCardDto.interests || '',
      position: businessCardDto.position,
      company: businessCardDto.company || '',
      email: businessCardDto.email || '',
      phone: businessCardDto.phone || '',
      wechat: businessCardDto.wechat || '',
      introduction: businessCardDto.introduction || '',
      avatarUrl: businessCardDto.avatarUrl || '',
      nickName: businessCardDto.nickName || '',
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    };

    this.businessCards.push(newCard);
    return newCard;
  }

  updateBusinessCard(userId: number, updates: any): BusinessCard | null {
    const cardIndex = this.businessCards.findIndex(
      (card) => card.userId === userId,
    );

    if (cardIndex === -1) {
      return null;
    }

    const updatedCard = {
      ...this.businessCards[cardIndex],
      ...updates,
      updateTime: new Date().toISOString(),
    };

    this.businessCards[cardIndex] = updatedCard;
    return updatedCard;
  }

  deleteBusinessCard(userId: number): boolean {
    const cardIndex = this.businessCards.findIndex(
      (card) => card.userId === userId,
    );

    if (cardIndex === -1) {
      return false;
    }

    this.businessCards.splice(cardIndex, 1);
    return true;
  }

  searchBusinessCards(query: {
    industry?: string;
    profession?: string;
    position?: string;
    keyword?: string;
  }): BusinessCard[] {
    let filteredCards = [...this.businessCards];

    if (query.industry) {
      filteredCards = filteredCards.filter((card) =>
        card.industry.toLowerCase().includes(query.industry!.toLowerCase()),
      );
    }

    if (query.profession) {
      filteredCards = filteredCards.filter((card) =>
        card.profession.toLowerCase().includes(query.profession!.toLowerCase()),
      );
    }

    if (query.position) {
      filteredCards = filteredCards.filter((card) =>
        card.position.toLowerCase().includes(query.position!.toLowerCase()),
      );
    }

    if (query.keyword) {
      const keyword = query.keyword.toLowerCase();
      filteredCards = filteredCards.filter(
        (card) =>
          card.nickName?.toLowerCase().includes(keyword) ||
          card.company?.toLowerCase().includes(keyword) ||
          card.introduction?.toLowerCase().includes(keyword) ||
          card.interests?.toLowerCase().includes(keyword),
      );
    }

    return filteredCards;
  }

  getRecommendBusinessCards(userId: number): BusinessCard[] {
    const userCard = this.getBusinessCard(userId);
    if (!userCard) {
      return this.businessCards.slice(0, 5);
    }

    const otherCards = this.businessCards.filter(
      (card) => card.userId !== userId,
    );

    const scoredCards = otherCards.map((card) => {
      let score = 0;

      if (card.industry === userCard.industry) score += 3;
      if (card.profession === userCard.profession) score += 2;
      if (card.position === userCard.position) score += 1;

      const commonInterests = this.getCommonInterests(
        userCard.interests,
        card.interests,
      );
      score += commonInterests.length;

      return { card, score };
    });

    scoredCards.sort((a, b) => b.score - a.score);

    return scoredCards.slice(0, 5).map((item) => item.card);
  }

  private getCommonInterests(interests1: string, interests2: string): string[] {
    const list1 = interests1.split(',').map((i) => i.trim().toLowerCase());
    const list2 = interests2.split(',').map((i) => i.trim().toLowerCase());

    return list1.filter((interest) => list2.includes(interest));
  }
}
