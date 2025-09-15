import { getUserGroupDetail, joinUserGroup } from '../../../model/usergroup';

Page({
  data: {
    groupInfo: null,
    loading: true
  },

  async loadGroupDetail(id) {
    try {
      this.setData({ loading: true });
      const result = await getUserGroupDetail(id);
      if (result.code === 200 && result.data) {
        this.setData({
          groupInfo: result.data,
          loading: false
        });
      } else {
        this.setData({ loading: false });
        wx.showToast({
          title: result.message || '圈子不存在',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('加载圈子详情失败:', error);
      this.setData({ loading: false });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  async onJoinGroup() {
    if (!this.data.groupInfo) return;
    
    try {
      wx.showLoading({ title: '加入中...' });
      const result = await joinUserGroup(this.data.groupInfo.id);
      wx.hideLoading();
      
      if (result.code === 200) {
        wx.showToast({
          title: '加入成功',
          icon: 'success'
        });
        this.setData({
          'groupInfo.memberCount': this.data.groupInfo.memberCount + 1
        });
      } else {
        wx.showToast({
          title: result.message || '加入失败',
          icon: 'none'
        });
      }
    } catch (error) {
      wx.hideLoading();
      console.error('加入圈子失败:', error);
      wx.showToast({
        title: '加入失败',
        icon: 'none'
      });
    }
  },

  onLoad(options) {
    if (options.id) {
      this.loadGroupDetail(parseInt(options.id));
    } else {
      this.setData({ loading: false });
      wx.showToast({
        title: '参数错误',
        icon: 'none'
      });
    }
  },
});
