const API_BASE_URL = 'http://localhost:8809';

export const getUserGroupList = () => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}/api/community`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error('请求失败'));
        }
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
};

export const getUserGroupDetail = (id) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}/api/community/${id}`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error('请求失败'));
        }
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
};

export const joinUserGroup = (id) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}/api/community/${id}/join`,
      method: 'POST',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error('请求失败'));
        }
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
};
