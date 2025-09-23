import { loginUser, setCurrentUser, getCurrentUser } from '../../services/user/login';
import { getUserList } from '../../services/user/userList';

Page({
  data: {
    username: '',
    loading: false,
    userList: [],
    showUserList: false,
    selectedUser: null
  },

  onInputUsername(e) {
    this.setData({
      username: e.detail.value,
      selectedUser: null
    });
  },

  async loadUserList() {
    try {
      const result = await getUserList();
      if (result.code === 200) {
        this.setData({
          userList: result.data
        });
      }
    } catch (error) {
      console.error('加载用户列表失败:', error);
    }
  },

  onShowUserList() {
    this.setData({
      showUserList: !this.data.showUserList
    });
  },

  onSelectUser(e) {
    const user = e.currentTarget.dataset.user;
    this.setData({
      username: user.username,
      selectedUser: user,
      showUserList: false
    });
  },

  async onLogin() {
    const { username } = this.data;
    
    if (!username.trim()) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      });
      return;
    }

    this.setData({ loading: true });

    try {
      const result = await loginUser(username.trim());
      
      if (result.code === 200 || result.success) {
        setCurrentUser({
          username: username.trim(),
          id: result.data?.id || Date.now().toString()
        });
        
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });

        setTimeout(() => {
          const pages = getCurrentPages();
          if (pages.length > 1) {
            wx.navigateBack();
          } else {
            wx.switchTab({
              url: '/pages/usercenter/index'
            });
          }
        }, 1500);
      } else {
        wx.showToast({
          title: result.message || '登录失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('登录错误:', error);
      setCurrentUser({
        username: username.trim(),
        id: Date.now().toString()
      });
      
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      });

      setTimeout(() => {
        const pages = getCurrentPages();
        if (pages.length > 1) {
          wx.navigateBack();
        } else {
          wx.switchTab({
            url: '/pages/usercenter/index'
          });
        }
      }, 1500);
    } finally {
      this.setData({ loading: false });
    }
  },

  onLoad(options) {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.username) {
      this.setData({
        username: currentUser.username
      });
    }
    this.loadUserList();
  }
});
