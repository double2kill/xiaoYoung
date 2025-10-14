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
    
    // 显示选择确认
    wx.showToast({
      title: `已选择 ${user.name}`,
      icon: 'success',
      duration: 1500
    });
  },

  async onLogin() {
    const { username, selectedUser } = this.data;
    
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
        // 使用选中的用户信息或API返回的信息
        const userInfo = selectedUser || {
          id: result.data?.id || Date.now().toString(),
          username: username.trim(),
          name: username.trim(),
          avatar: '',
          company: '',
          position: ''
        };
        
        setCurrentUser({
          id: userInfo.id,
          username: userInfo.username,
          name: userInfo.name,
          avatar: userInfo.avatar,
          company: userInfo.company,
          position: userInfo.position
        });
        
        wx.showToast({
          title: `欢迎回来，${userInfo.name}`,
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
      
      // 如果API失败，使用选中的用户信息
      if (selectedUser) {
        setCurrentUser({
          id: selectedUser.id,
          username: selectedUser.username,
          name: selectedUser.name,
          avatar: selectedUser.avatar,
          company: selectedUser.company,
          position: selectedUser.position
        });
        
        wx.showToast({
          title: `欢迎回来，${selectedUser.name}`,
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
          title: '登录失败',
          icon: 'none'
        });
      }
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
