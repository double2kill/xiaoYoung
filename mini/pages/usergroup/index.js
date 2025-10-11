import { getUserGroupList } from '../../model/usergroup';
import { formatTimeChinese } from '../../utils/util';

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
        // 格式化时间
        const formattedData = result.data.map(item => ({
          ...item,
          createdAt: formatTimeChinese(item.createdAt, 'date')
        }));
        
        this.setData({
          groupList: formattedData,
          loading: false
        });
      } else {
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
