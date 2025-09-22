import { fetchUserCenter } from '../../services/usercenter/fetchUsercenter';
import Toast from 'tdesign-miniprogram/toast/index';

const menuData = [
  [
    {
      title: '我的名片',
      tit: '',
      url: '',
      type: 'business-card',
      icon: 'user',
    },
    {
      title: '我的消息',
      tit: '',
      url: '',
      type: 'message',
      icon: 'chat',
    },
  ],
  [
    {
      title: '我的圈子',
      tit: '',
      url: '',
      type: 'circle',
      icon: 'group',
    },
    {
      title: '我的活动',
      tit: '',
      url: '',
      type: 'activity',
      icon: 'calendar',
    },
  ],
  [
    {
      title: '账号设置',
      tit: '',
      url: '',
      type: 'settings',
      icon: 'setting',
    },
  ],
];


const getDefaultData = () => ({
  userInfo: {
    avatarUrl: '',
    nickName: '正在登录...',
    phoneNumber: '',
  },
  menuData,
  currAuthStep: 1,
  versionNo: '',
});

Page({
  data: getDefaultData(),

  onLoad() {
    this.getVersionInfo();
  },

  onShow() {
    this.getTabBar().init();
    this.init();
  },
  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.fetUseriInfoHandle();
  },

  fetUseriInfoHandle() {
    fetchUserCenter().then(({ userInfo }) => {
      this.setData({
        userInfo,
        menuData,
        currAuthStep: 2,
      });
      wx.stopPullDownRefresh();
    });
  },

  onClickCell({ currentTarget }) {
    const { type } = currentTarget.dataset;

    switch (type) {
      case 'business-card': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '我的名片功能开发中',
          icon: '',
          duration: 1000,
        });
        break;
      }
      case 'message': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '我的消息功能开发中',
          icon: '',
          duration: 1000,
        });
        break;
      }
      case 'circle': {
        wx.navigateTo({ url: '/pages/usergroup/index' });
        break;
      }
      case 'activity': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '我的活动功能开发中',
          icon: '',
          duration: 1000,
        });
        break;
      }
      case 'settings': {
        wx.navigateTo({ url: '/pages/user/person-info/index' });
        break;
      }
      default: {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '未知跳转',
          icon: '',
          duration: 1000,
        });
        break;
      }
    }
  },


  gotoUserEditPage() {
    const { currAuthStep } = this.data;
    if (currAuthStep === 2) {
      wx.navigateTo({ url: '/pages/user/person-info/index' });
    } else {
      this.fetUseriInfoHandle();
    }
  },

  getVersionInfo() {
    const versionInfo = wx.getAccountInfoSync();
    const { version, envVersion = __wxConfig } = versionInfo.miniProgram;
    this.setData({
      versionNo: envVersion === 'release' ? version : envVersion,
    });
  },
});
