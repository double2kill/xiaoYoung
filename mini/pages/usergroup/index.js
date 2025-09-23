import { getUserGroupList } from '../../model/usergroup';

Page({
  data: {
    groupList: [],
    loading: true
  },

  async loadGroupList() {
    try {
      console.log('开始加载圈子列表...');
      this.setData({ loading: true });
      const result = await getUserGroupList();
      console.log('API返回结果:', result);
      if (result.code === 200) {
        this.setData({
          groupList: result.data,
          loading: false
        });
        console.log('圈子列表加载成功，数据:', result.data);
      } else {
        console.error('API返回错误:', result);
        this.setData({ loading: false });
      }
    } catch (error) {
      console.error('加载圈子列表失败:', error);
      this.setData({ loading: false });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  onGroupTap(e) {
    const id = e.currentTarget.dataset.id;
    console.log('点击圈子ID:', id);
    wx.navigateTo({
      url: `/pages/usergroup/detail/index?id=${id}`,
      success: () => {
        console.log('跳转成功');
      },
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
