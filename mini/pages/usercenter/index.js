import { fetchUserCenter } from '../../services/usercenter/fetchUsercenter';
import { getCurrentUser, logoutUser } from '../../services/user/login';
import { getBusinessCard } from '../../services/business-card/index';
import Toast from 'tdesign-miniprogram/toast/index';

const menuData = [
  [
    {
      title: '我的消息',
      tit: '',
      url: '',
      type: 'message',
      icon: 'chat',
    },
    {
      title: '名片搜索',
      tit: '',
      url: '',
      type: 'card-search',
      icon: 'search',
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
  currentUser: null,
  businessCard: null,
  businessCardLoading: false,
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
    this.checkLoginStatus();
    this.fetUseriInfoHandle();
    this.loadBusinessCard();
  },

  checkLoginStatus() {
    const currentUser = getCurrentUser();
    this.setData({
      currentUser
    });
    
    if (!currentUser) {
      this.setData({
        userInfo: {
          avatarUrl: '',
          nickName: '未登录',
          phoneNumber: '',
        }
      });
    }
  },

  fetUseriInfoHandle() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      wx.stopPullDownRefresh();
      return;
    }

    fetchUserCenter().then(({ userInfo }) => {
      this.setData({
        userInfo: {
          ...userInfo,
          nickName: currentUser.username
        },
        menuData,
        currAuthStep: 2,
      });
      wx.stopPullDownRefresh();
    });
  },

  onClickCell({ currentTarget }) {
    const { type } = currentTarget.dataset;

    switch (type) {
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
      case 'card-search': {
        wx.navigateTo({ url: '/pages/user/business-card-search/index' });
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
    const { currAuthStep, currentUser } = this.data;
    if (!currentUser) {
      wx.navigateTo({ url: '/pages/login/index' });
      return;
    }
    
    if (currAuthStep === 2) {
      wx.navigateTo({ url: '/pages/user/person-info/index' });
    } else {
      this.fetUseriInfoHandle();
    }
  },

  gotoLogin() {
    wx.navigateTo({ url: '/pages/login/index' });
  },

  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出当前账号吗？',
      success: (res) => {
        if (res.confirm) {
          logoutUser();
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
          setTimeout(() => {
            wx.navigateTo({ 
              url: '/pages/login/index' 
            });
          }, 1500);
        }
      }
    });
  },

  async loadBusinessCard() {
    const currentUser = this.data.currentUser;
    if (!currentUser) return;
    
    this.setData({ businessCardLoading: true });
    
    try {
      const businessCard = await getBusinessCard(currentUser.id);
      this.setData({ 
        businessCard: {
          ...businessCard,
          nickName: currentUser?.username || '',
          avatarUrl: currentUser?.avatarUrl || ''
        },
        businessCardLoading: false
      });
    } catch (error) {
      console.error('加载个人名片失败:', error);
      const localCard = wx.getStorageSync('businessCard');
      this.setData({ 
        businessCard: {
          ...localCard,
          nickName: currentUser?.username || '',
          avatarUrl: currentUser?.avatarUrl || ''
        },
        businessCardLoading: false
      });
    }
  },

  onEditBusinessCard() {
    wx.navigateTo({ url: '/pages/user/business-card/index' });
  },

  getVersionInfo() {
    const versionInfo = wx.getAccountInfoSync();
    const { version, envVersion = __wxConfig } = versionInfo.miniProgram;
    this.setData({
      versionNo: envVersion === 'release' ? version : envVersion,
    });
  },
});
