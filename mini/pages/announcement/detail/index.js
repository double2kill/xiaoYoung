import Toast from 'tdesign-miniprogram/toast/index';
import announcementModel from '../../../model/announcement';

Page({
  data: {
    announcement: {},
    announcementId: ''
  },

  onLoad(options) {
    const { announcementId } = options;
    if (announcementId) {
      this.setData({ announcementId });
      this.loadAnnouncementDetail(announcementId);
    } else {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '参数错误',
      });
    }
  },

  loadAnnouncementDetail(id) {
    const announcement = announcementModel.getAnnouncementById(id);
    if (announcement) {
      this.setData({ announcement });
      wx.setNavigationBarTitle({
        title: announcement.title
      });
    } else {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '动态不存在',
      });
    }
  }
});
