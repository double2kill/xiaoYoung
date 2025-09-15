import { fetchHome } from '../../services/home/home';
import Toast from 'tdesign-miniprogram/toast/index';
import announcementModel from '../../model/announcement';

Page({
  data: {
    imgSrcs: [],
    tabList: [],
    announcementList: [],
    pageLoading: false,
    current: 1,
    autoplay: true,
    duration: '500',
    interval: 5000,
    navigation: { type: 'dots' },
    swiperImageProps: { mode: 'scaleToFill' },
  },

  privateData: {
    tabIndex: 0,
  },

  onShow() {
    this.getTabBar().init();
  },

  onLoad() {
    this.init();
  },


  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.loadHomePage();
    this.loadMockAnnouncementData();
  },

  loadHomePage() {
    wx.stopPullDownRefresh();

    this.setData({
      pageLoading: true,
    });
    fetchHome().then(({ swiper, tabList }) => {
      this.setData({
        tabList,
        imgSrcs: swiper,
        pageLoading: false,
      });
    });
  },

  tabChangeHandle(e) {
    this.privateData.tabIndex = e.detail;
  },


  loadMockAnnouncementData() {
    const topAnnouncements = announcementModel.getTopAnnouncements(3);
    
    this.setData({
      announcementList: topAnnouncements
    });
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

  goToMoreAnnouncements() {
    wx.navigateTo({
      url: '/pages/announcement/list/index',
    });
  },
});
