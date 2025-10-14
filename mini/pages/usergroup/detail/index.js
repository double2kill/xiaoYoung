import { getUserGroupDetail, joinUserGroup, getUserGroupEvents, getUserGroupDynamics } from '../../../model/usergroup';
import { formatTimeChinese } from '../../../utils/util';
import { getCurrentUser } from '../../../services/user/login';

Page({
  data: {
    groupInfo: null,
    loading: true,
    events: [],
    dynamics: []
  },

  async loadGroupDetail(id) {
    try {
      this.setData({ loading: true });
      const result = await getUserGroupDetail(id);
      if (result.code === 200 && result.data) {
        // 格式化时间
        const formattedData = {
          ...result.data,
          createdAt: formatTimeChinese(result.data.createdAt, 'datetime'),
          members: result.data.members ? result.data.members.map(member => ({
            ...member,
            joinedAt: formatTimeChinese(member.joinedAt, 'date')
          })) : [],
          // 确保创建者信息存在
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
          loading: false
        });
        
        // 加载相关数据
        this.loadEvents(id);
        this.loadDynamics(id);
      } else {
        this.setData({ loading: false });
        wx.showToast({
          title: result.message || '圈子不存在',
          icon: 'none'
        });
      }
    } catch (error) {
      this.setData({ loading: false });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  async loadEvents(groupId) {
    try {
      const result = await getUserGroupEvents(groupId);
      if (result.code === 200) {
        const formattedEvents = result.data.map(event => ({
          ...event,
          startTime: formatTimeChinese(event.startTime, 'datetime'),
          createdAt: formatTimeChinese(event.createdAt, 'date')
        }));
        
        this.setData({
          events: formattedEvents
        });
      } else {
        this.setData({
          events: []
        });
      }
    } catch (error) {
      this.setData({
        events: []
      });
    }
  },

  async loadDynamics(groupId) {
    try {
      const result = await getUserGroupDynamics(groupId);
      if (result.code === 200) {
        const formattedDynamics = result.data.map(dynamic => ({
          ...dynamic,
          createdAt: formatTimeChinese(dynamic.createdAt, 'datetime')
        }));
        
        this.setData({
          dynamics: formattedDynamics
        });
      } else {
        this.setData({
          dynamics: []
        });
      }
    } catch (error) {
      this.setData({
        dynamics: []
      });
    }
  },

  async onJoinGroup() {
    if (!this.data.groupInfo) return;
    
    // 检查用户是否已登录
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.id) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    
    try {
      wx.showLoading({ title: '加入中...' });
      
      const result = await joinUserGroup(this.data.groupInfo.id, { userId: currentUser.id });
      wx.hideLoading();
      
      if (result && (result.code === 200 || result.code === '200')) {
        wx.showToast({
          title: '加入成功',
          icon: 'success'
        });
        this.setData({
          'groupInfo.memberCount': this.data.groupInfo.memberCount + 1
        });
        
        setTimeout(() => {
          this.loadGroupDetail(this.data.groupInfo.id);
        }, 1000);
      } else {
        wx.showToast({
          title: result?.message || '加入失败',
          icon: 'none'
        });
      }
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '加入失败',
        icon: 'none'
      });
    }
  },

  onViewMembers() {
    if (!this.data.groupInfo) return;
    
    wx.navigateTo({
      url: `/pages/usergroup/members/index?groupId=${this.data.groupInfo.id}`,
      fail: (err) => {
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },


  onLoad(options) {
    if (options.id) {
      this.loadGroupDetail(options.id);
    } else {
      this.setData({ loading: false });
      wx.showToast({
        title: '参数错误',
        icon: 'none'
      });
    }
  },
});
