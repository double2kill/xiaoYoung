import { getUserGroupList } from '../../model/usergroup';

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
        this.setData({
          groupList: result.data,
          loading: false
        });
      }
    } catch (error) {
      console.error('加载圈子列表失败:', error);
      this.setData({ loading: false });
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
  },

  onLoad() {
    this.loadGroupList();
  },
});
