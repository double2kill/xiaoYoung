import Toast from 'tdesign-miniprogram/toast/index';
import announcementModel from '../../../model/announcement';

Page({
  data: {
    announcementList: [],
    categoryList: [
      { key: 'all', text: '全部' },
      { key: 'activity', text: '活动' },
      { key: 'notice', text: '通知' },
      { key: 'news', text: '资讯' }
    ],
    currentCategory: 'all',
    currentTabIndex: 0,
    loadStatus: 0,
    pageIndex: 1,
    pageSize: 10,
    hasMore: true
  },

  onLoad() {
    console.log('页面加载，当前分类:', this.data.currentCategory);
    this.loadAnnouncementList(true);
  },

  onReachBottom() {
    if (this.data.loadStatus === 0 && this.data.hasMore) {
      this.loadAnnouncementList();
    }
  },

  onPullDownRefresh() {
    this.loadAnnouncementList(true);
  },

  loadAnnouncementList(fresh = false) {
    if (fresh) {
      this.setData({
        pageIndex: 1,
        hasMore: true
      });
      wx.pageScrollTo({
        scrollTop: 0,
      });
    }

    this.setData({ loadStatus: 1 });

    setTimeout(() => {
      const { pageIndex, pageSize, currentCategory } = this.data;
      const result = announcementModel.getAnnouncementsByPage(pageIndex, pageSize, currentCategory);
      
      console.log('加载数据:', {
        category: currentCategory,
        pageIndex,
        pageSize,
        dataLength: result.data.length,
        hasMore: result.hasMore
      });
      
      this.setData({
        announcementList: fresh ? result.data : this.data.announcementList.concat(result.data),
        loadStatus: result.hasMore ? 0 : 2,
        hasMore: result.hasMore,
        pageIndex: pageIndex + 1
      });

      wx.stopPullDownRefresh();
    }, 500);
  },

  announcementListClickHandle(e) {
    const { index } = e.detail;
    const { id } = this.data.announcementList[index];
    wx.navigateTo({
      url: `/pages/announcement/detail/index?announcementId=${id}`,
    });
  },

  announcementListThumbHandle(e) {
    const { index } = e.detail;
    const announcement = this.data.announcementList[index];
    Toast({
      context: this,
      selector: '#t-toast',
      message: `预览公告：${announcement.title}`,
    });
  },

  onRetry() {
    this.loadAnnouncementList();
  },

  categoryChangeHandle(e) {
    console.log('事件对象:', e);
    const categoryIndex = e.detail.value || e.detail;
    const categoryKey = this.data.categoryList[categoryIndex].key;
    
    console.log('切换分类:', categoryKey, '索引:', categoryIndex);
    
    this.setData({
      currentCategory: categoryKey,
      currentTabIndex: categoryIndex,
      pageIndex: 1,
      hasMore: true
    });
    
    this.loadAnnouncementList(true);
  }
});
