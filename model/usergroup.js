const mockUserGroups = [
  {
    id: 1,
    name: '经济学院校友分会(筹)',
    memberCount: 175,
    rating: [true, true, false, false, false],
    contactName: '程远蝶',
    contactPhone: '199****3107',
    description: '经济学院校友交流平台，促进校友间的联系与合作',
    createTime: '2023-01-15',
    lastActiveTime: '2024-01-20'
  },
  {
    id: 2,
    name: '计算机学院校友会',
    memberCount: 320,
    rating: [true, true, true, true, false],
    contactName: '张明',
    contactPhone: '138****5678',
    description: '计算机学院校友技术交流与职业发展平台',
    createTime: '2022-08-10',
    lastActiveTime: '2024-01-22'
  },
  {
    id: 3,
    name: '商学院MBA校友圈',
    memberCount: 89,
    rating: [true, true, true, false, false],
    contactName: '李华',
    contactPhone: '186****9012',
    description: 'MBA校友商业合作与经验分享圈子',
    createTime: '2023-03-20',
    lastActiveTime: '2024-01-18'
  },
  {
    id: 4,
    name: '艺术学院校友联盟',
    memberCount: 156,
    rating: [true, true, false, false, false],
    contactName: '王艺',
    contactPhone: '159****3456',
    description: '艺术创作交流与作品展示平台',
    createTime: '2023-06-05',
    lastActiveTime: '2024-01-19'
  },
  {
    id: 5,
    name: '医学院校友分会',
    memberCount: 245,
    rating: [true, true, true, true, true],
    contactName: '陈医生',
    contactPhone: '177****7890',
    description: '医学专业交流与学术研讨平台',
    createTime: '2022-12-01',
    lastActiveTime: '2024-01-21'
  },
  {
    id: 6,
    name: '工程学院校友会',
    memberCount: 198,
    rating: [true, true, true, false, false],
    contactName: '刘工程师',
    contactPhone: '135****2468',
    description: '工程技术交流与项目合作平台',
    createTime: '2023-02-14',
    lastActiveTime: '2024-01-17'
  }
];

export const getUserGroupList = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: mockUserGroups,
        message: '获取成功'
      });
    }, 500);
  });
};

export const getUserGroupDetail = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const group = mockUserGroups.find(item => item.id === id);
      resolve({
        code: 200,
        data: group || null,
        message: group ? '获取成功' : '圈子不存在'
      });
    }, 300);
  });
};

export const joinUserGroup = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const group = mockUserGroups.find(item => item.id === id);
      if (group) {
        group.memberCount += 1;
        resolve({
          code: 200,
          data: { success: true },
          message: '加入成功'
        });
      } else {
        resolve({
          code: 404,
          data: { success: false },
          message: '圈子不存在'
        });
      }
    }, 800);
  });
};
