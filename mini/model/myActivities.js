const myActivitiesData = [
  {
    id: '1',
    title: '校友会年度表彰大会',
    description: '表彰优秀校友，回顾年度成果',
    time: '2025-09-15 14:00',
    status: 'upcoming',
    category: 'activity',
    location: '学校大礼堂',
    participants: 120,
    image: 'https://picsum.photos/400/200?random=1'
  },
  {
    id: '2',
    title: '校友企业合作交流座谈会',
    description: '促进校友企业间的合作与交流',
    time: '2025-09-10 09:00',
    status: 'ongoing',
    category: 'activity',
    location: '校友会会议室',
    participants: 45,
    image: 'https://picsum.photos/400/200?random=2'
  },
  {
    id: '3',
    title: '校友创业基金申请说明会',
    description: '详细介绍创业基金申请流程和要求',
    time: '2025-09-08 15:30',
    status: 'ended',
    category: 'activity',
    location: '创业孵化中心',
    participants: 80,
    image: 'https://picsum.photos/400/200?random=3'
  },
  {
    id: '4',
    title: '校友导师制度启动仪式',
    description: '建立校友导师制度，助力在校学生发展',
    time: '2025-09-20 10:00',
    status: 'upcoming',
    category: 'activity',
    location: '学生活动中心',
    participants: 60,
    image: 'https://picsum.photos/400/200?random=4'
  },
  {
    id: '5',
    title: '校友企业招聘会',
    description: '为在校学生提供就业机会',
    time: '2025-09-05 09:00',
    status: 'ended',
    category: 'activity',
    location: '体育馆',
    participants: 200,
    image: 'https://picsum.photos/400/200?random=5'
  },
  {
    id: '6',
    title: '校友会青年分会成立仪式',
    description: '青年校友分会正式成立',
    time: '2025-09-12 16:00',
    status: 'ongoing',
    category: 'activity',
    location: '青年活动中心',
    participants: 35,
    image: 'https://picsum.photos/400/200?random=6'
  },
  {
    id: '7',
    title: '校友企业技术创新成果展示',
    description: '展示校友企业的技术创新成果',
    time: '2025-09-18 14:00',
    status: 'upcoming',
    category: 'activity',
    location: '科技楼展厅',
    participants: 90,
    image: 'https://picsum.photos/400/200?random=7'
  },
  {
    id: '8',
    title: '校友会志愿者服务队成立',
    description: '成立志愿者服务队，服务校友和学校',
    time: '2025-09-03 11:00',
    status: 'ended',
    category: 'activity',
    location: '志愿者服务中心',
    participants: 25,
    image: 'https://picsum.photos/400/200?random=8'
  }
];

const myActivitiesModel = {
  getMyActivities(pageIndex = 1, pageSize = 10, filterType = 'all') {
    let filteredData = myActivitiesData;
    
    if (filterType !== 'all') {
      filteredData = myActivitiesData.filter(item => item.status === filterType);
    }
    
    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
      data: filteredData.slice(startIndex, endIndex),
      hasMore: endIndex < filteredData.length,
      total: filteredData.length
    };
  },

  getActivityById(id) {
    return myActivitiesData.find(item => item.id === id);
  },

  getActivitiesByStatus(status) {
    return myActivitiesData.filter(item => item.status === status);
  }
};

module.exports = myActivitiesModel;
