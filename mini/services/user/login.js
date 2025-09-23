const API_BASE_URL = 'http://localhost:8809';

export const loginUser = (username) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}/api/user/login`,
      method: 'POST',
      data: {
        username: username.trim()
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error('登录请求失败'));
        }
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
};

export const getCurrentUser = () => {
  return wx.getStorageSync('currentUser') || null;
};

export const setCurrentUser = (userInfo) => {
  wx.setStorageSync('currentUser', {
    ...userInfo,
    loginTime: Date.now()
  });
};

export const logoutUser = () => {
  wx.removeStorageSync('currentUser');
};

export const isUserLoggedIn = () => {
  const user = getCurrentUser();
  return user && user.username;
};
