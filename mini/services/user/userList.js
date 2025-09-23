const API_BASE_URL = 'http://localhost:8809';

export const getUserList = () => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}/api/user-list`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error('获取用户列表失败'));
        }
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
};
