import { getUserGroupList } from '../../model/usergroup';
import { formatTimeChinese } from '../../utils/util';
import { getCurrentUser } from '../../services/user/login';

Page({
  data: {
    groupList: [],
    loading: true
  },

  async loadGroupList() {
    try {
      this.setData({ loading: true });
      const result = await getUserGroupList();
      if (result.code === 200) {
        const currentUser = getCurrentUser();
        const currentUserId = currentUser ? currentUser.id.toString() : null;
        
        // 格式化时间并检查用户是否已加入
        const formattedData = result.data.map(item => {
          const isJoined = currentUserId && item.members && 
            item.members.some(member => member.userId.toString() === currentUserId);
          
          return {
            ...item,
            createdAt: formatTimeChinese(item.createdAt, 'date'),
            isJoined: isJoined || false,
            // 确保创建者信息存在
            createdByInfo: item.createdByInfo || {
              name: item.createdBy || '未知用户',
              username: '',
              avatar: '',
              company: '',
              position: ''
            }
          };
        });
        
        this.setData({
          groupList: formattedData,
          loading: false
        });
      } else {
        this.setData({ loading: false });
      }
    } catch (error) {
      this.setData({ loading: false });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  onGroupTap(e) {
    const id = e.currentTarget.dataset.id;
    
    if (!id) {
      wx.showToast({
        title: '圈子ID错误',
        icon: 'none'
      });
      return;
    }
    
    wx.navigateTo({
      url: `/pages/usergroup/detail/index?id=${id}`,
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  onShow() {
    this.getTabBar().init();
    this.loadGroupList();
  },

  onLoad() {
    this.loadGroupList();
  },
});
