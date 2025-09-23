Page({
  data: {
    businessCard: {}
  },

  onLoad(options) {
    if (options.data) {
      try {
        const businessCard = JSON.parse(decodeURIComponent(options.data));
        this.setData({ businessCard });
      } catch (error) {
        console.error('解析名片数据失败:', error);
        wx.showToast({
          title: '数据解析失败',
          icon: 'error'
        });
      }
    }
  },

  onEdit() {
    wx.navigateBack();
  },

  onShare() {
    wx.showShareMenu({
      withShareTicket: true
    });
  }
});
