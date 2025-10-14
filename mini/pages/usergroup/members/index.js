import { getUserGroupDetail } from '../../../model/usergroup';
import { formatTimeChinese } from '../../../utils/util';

Page({
  data: {
    groupId: '',
    groupInfo: null,
    members: [],
    loading: true
  },

  async loadMembers() {
    try {
      this.setData({ loading: true });
      const result = await getUserGroupDetail(this.data.groupId);
      
      if (result.code === 200 && result.data) {
        const formattedData = {
          ...result.data,
          createdAt: formatTimeChinese(result.data.createdAt, 'datetime'),
          members: result.data.members ? result.data.members.map(member => ({
            ...member,
            joinedAt: formatTimeChinese(member.joinedAt, 'date')
          })) : [],
          createdByInfo: result.data.createdByInfo || {
            name: result.data.createdBy || '未知用户',
            username: '',
            avatar: '',
            company: '',
            position: ''
          }
        };
        
        this.setData({
          groupInfo: formattedData,
          members: formattedData.members,
          loading: false
        });
      } else {
        this.setData({ loading: false });
        wx.showToast({
          title: result.message || '获取成员列表失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('加载成员列表失败:', error);
      this.setData({ loading: false });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  onLoad(options) {
    if (options.groupId) {
      this.setData({ groupId: options.groupId });
      this.loadMembers();
    } else {
      this.setData({ loading: false });
      wx.showToast({
        title: '参数错误',
        icon: 'none'
      });
    }
  },

  onShow() {
    // 每次显示页面时重新加载数据，确保数据是最新的
    if (this.data.groupId) {
      this.loadMembers();
    }
  }
});
