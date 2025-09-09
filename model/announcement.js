const content = `亲爱的校友们，时光荏苒，岁月如梭。自我们离开母校的那一刻起，无论走到哪里，无论身在何方，母校永远是我们心中最温暖的港湾。校友会作为连接母校与校友的桥梁，始终致力于为每一位校友提供最优质的服务，搭建最广阔的交流平台。我们深知，每一位校友都是母校的骄傲，都是社会的中坚力量。在这个充满机遇与挑战的时代，校友会将继续秉承"服务校友、服务母校、服务社会"的宗旨，不断创新服务模式，拓展服务领域，为校友们的事业发展提供强有力的支持。我们相信，通过大家的共同努力，校友会必将成为校友们最信赖的组织，成为母校最亮丽的名片。让我们携手并进，共创美好未来！`

const announcementData = [
  {
    id: '1',
    title: '关于举办2025年校友返校日活动的通知',
    image: 'https://picsum.photos/400/200?random=1',
    time: '2025-09-09 14:30',
    views: '1.2万',
    category: 'activity',
    content
  },
  {
    id: '2', 
    title: '校友会理事会换届选举公告',
    image: 'https://picsum.photos/400/200?random=2',
    time: '2025-09-09 12:15',
    views: '856',
    category: 'notice',
    content
  },
  {
    id: '3',
    title: '校友创业基金申请指南及流程说明',
    image: 'https://picsum.photos/400/200?random=3',
    time: '2025-09-09 10:45',
    views: '2.1万',
    category: 'notice',
    content
  },
  {
    id: '4',
    title: '校友企业招聘信息汇总（2025年9月）',
    image: 'https://picsum.photos/400/200?random=4',
    time: '2025-09-08 16:20',
    views: '3.5万',
    category: 'news',
    content
  },
  {
    id: '5',
    title: '关于建立校友导师制度的倡议书',
    image: 'https://picsum.photos/400/200?random=5',
    time: '2025-09-08 14:10',
    views: '1.8万',
    category: 'notice',
    content
  },
  {
    id: '6',
    title: '校友会年度工作总结及下年度计划',
    image: 'https://picsum.photos/400/200?random=6',
    time: '2025-09-08 11:30',
    views: '945',
    category: 'news',
    content
  },
  {
    id: '7',
    title: '校友企业合作交流座谈会成功举办',
    image: 'https://picsum.photos/400/200?random=7',
    time: '2025-09-07 18:45',
    views: '1.3万',
    category: 'activity',
    content
  },
  {
    id: '8',
    title: '校友捐赠助力学校基础设施建设',
    image: 'https://picsum.photos/400/200?random=8',
    time: '2025-09-07 15:30',
    views: '2.8万',
    category: 'news',
    content
  },
  {
    id: '9',
    title: '校友会青年分会成立仪式圆满举行',
    image: 'https://picsum.photos/400/200?random=9',
    time: '2025-09-07 12:15',
    views: '1.6万',
    category: 'activity',
    content
  },
  {
    id: '10',
    title: '校友企业实习基地签约仪式',
    image: 'https://picsum.photos/400/200?random=10',
    time: '2025-09-06 20:30',
    views: '2.2万',
    category: 'activity',
    content
  },
  {
    id: '11',
    title: '校友会年度表彰大会圆满落幕',
    image: 'https://picsum.photos/400/200?random=11',
    time: '2025-09-06 16:20',
    views: '1.9万',
    category: 'activity',
    content
  },
  {
    id: '12',
    title: '校友企业技术创新成果展示',
    image: 'https://picsum.photos/400/200?random=12',
    time: '2025-09-06 14:10',
    views: '2.4万',
    category: 'news',
    content
  },
  {
    id: '13',
    title: '校友会海外分会成立仪式',
    image: 'https://picsum.photos/400/200?random=13',
    time: '2025-09-05 18:45',
    views: '1.7万',
    category: 'activity',
    content
  },
  {
    id: '14',
    title: '校友企业社会责任报告发布',
    image: 'https://picsum.photos/400/200?random=14',
    time: '2025-09-05 15:30',
    views: '2.1万',
    category: 'news',
    content
  },
  {
    id: '15',
    title: '校友会志愿者服务队成立',
    image: 'https://picsum.photos/400/200?random=15',
    time: '2025-09-05 12:15',
    views: '1.4万',
    category: 'activity',
    content
  }
];

const announcementModel = {
  getAllAnnouncements() {
    return announcementData;
  },

  getTopAnnouncements(count = 3) {
    return announcementData.slice(0, count);
  },

  getAnnouncementsByPage(pageIndex = 1, pageSize = 10, category = 'all') {
    let filteredData = announcementData;
    
    if (category !== 'all') {
      filteredData = announcementData.filter(item => item.category === category);
    }
    
    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return {
      data: filteredData.slice(startIndex, endIndex),
      hasMore: endIndex < filteredData.length,
      total: filteredData.length
    };
  },

  getAnnouncementById(id) {
    return announcementData.find(item => item.id === id);
  },

  getAnnouncementsByKeyword(keyword) {
    return announcementData.filter(item => 
      item.title.includes(keyword)
    );
  },

  getAnnouncementsByCategory(category) {
    if (category === 'all') {
      return announcementData;
    }
    return announcementData.filter(item => item.category === category);
  }
};

module.exports = announcementModel;
