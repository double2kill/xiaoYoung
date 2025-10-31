import { getUserGroupList } from '../../../model/usergroup';
import { formatTimeChinese } from '../../../utils/util';
import { getCurrentUser } from '../../../services/user/login';

Page({
  data: {
    groupList: [],
    loading: true
  },

  async loadMyGroups() {
    try {
      this.setData({ loading: true });
      const result = await getUserGroupList();
      if (result.code === 200) {
        const currentUser = getCurrentUser();
        const currentUserId = currentUser ? String(currentUser.id) : null;

        const normalizeMemberUserId = (m) => {
          const uid = m && (m.user?.id ?? m.userId);
          if (uid == null) return null;
          if (typeof uid === 'object') {
            if (uid._id) return String(uid._id);
            if (uid.id) return String(uid.id);
            return null;
          }
          return String(uid);
        };

        const formattedData = result.data.map(item => {
          const isJoined = !!currentUserId && Array.isArray(item.members) && item.members.some(member => normalizeMemberUserId(member) === currentUserId);
          return {
            ...item,
            createdAt: formatTimeChinese(item.createdAt, 'date'),
            isJoined,
            createdByInfo: item.createdByInfo || {
              name: item.createdBy || '未知用户',
              username: '',
              avatar: '',
              company: '',
              position: ''
            }
          };
        });

        const myGroups = formattedData.filter(item => item.isJoined);
        this.setData({ groupList: myGroups, loading: false });
      } else {
        this.setData({ loading: false });
      }
    } catch (e) {
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  onGroupTap(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) {
      wx.showToast({ title: '圈子ID错误', icon: 'none' });
      return;
    }
    wx.navigateTo({ url: `/pages/usergroup/detail/index?id=${id}` });
  },

  onGoAllGroups() {
    wx.navigateTo({ url: '/pages/usergroup/index' });
  },

  onShow() {
    if (this.getTabBar && this.getTabBar()) {
      this.getTabBar().init();
    }
    this.loadMyGroups();
  },

  onLoad() {
    this.loadMyGroups();
  },

  async onPullDownRefresh() {
    try {
      await this.loadMyGroups();
    } finally {
      wx.stopPullDownRefresh();
    }
  },
});


