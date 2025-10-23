import { BASE_URL } from '../_utils/constant';

export const getBusinessCard = async (userId) => {
  try {
    const userIdNum = parseInt(userId);
    const requestUrl = `${BASE_URL}/api/business-card/${userIdNum}`;
    console.log('getBusinessCard: 开始请求名片数据，用户ID:', userId, '转换后:', userIdNum);
    console.log('getBusinessCard: 请求URL:', requestUrl);
    
    const response = await new Promise((resolve, reject) => {
      wx.request({
        url: requestUrl,
        method: 'GET',
        timeout: 10000,
        success: (res) => {
          console.log('getBusinessCard: 请求成功:', res);
          resolve(res);
        },
        fail: (err) => {
          console.error('getBusinessCard: 请求失败:', err);
          reject(err);
        }
      });
    });
    
    console.log('getBusinessCard: API响应:', response);
    console.log('getBusinessCard: 响应状态码:', response.statusCode);
    console.log('getBusinessCard: 响应数据:', response.data);
    
    if (response.data && response.data.code === 200) {
      const cardData = response.data.data || {};
      console.log('getBusinessCard: 解析后的名片数据:', cardData);
      wx.setStorageSync('businessCard', cardData);
      return cardData;
    }
    
    console.log('getBusinessCard: API返回错误，状态码:', response.statusCode, '错误信息:', response.data);
    const localCard = wx.getStorageSync('businessCard');
    return localCard || getDefaultBusinessCard();
  } catch (error) {
    console.error('获取个人名片失败:', error);
    console.error('错误类型:', typeof error);
    console.error('错误详情:', JSON.stringify(error));
    const localCard = wx.getStorageSync('businessCard');
    return localCard || getDefaultBusinessCard();
  }
};

const getDefaultBusinessCard = () => ({
  industry: '',
  profession: '',
  interests: '',
  position: '',
  company: '',
  email: '',
  phone: '',
  wechat: '',
  introduction: ''
});

export const saveBusinessCard = async (businessCard, userId) => {
  try {
    const userIdNum = parseInt(userId);
    const response = await wx.request({
      url: `${API_BASE_URL}/api/business-card`,
      method: 'POST',
      data: {
        ...businessCard,
        userId: userIdNum
      }
    });
    
    if (response.data.code === 200) {
      wx.setStorageSync('businessCard', businessCard);
      return true;
    }
    
    wx.setStorageSync('businessCard', businessCard);
    return true;
  } catch (error) {
    console.error('保存个人名片失败:', error);
    wx.setStorageSync('businessCard', businessCard);
    return true;
  }
};

export const updateBusinessCard = async (userId, updates) => {
  try {
    const userIdNum = parseInt(userId);
    const response = await wx.request({
      url: `${API_BASE_URL}/api/business-card/${userIdNum}`,
      method: 'PUT',
      data: updates
    });
    
    if (response.data.code === 200) {
      const currentCard = wx.getStorageSync('businessCard') || {};
      const updatedCard = { ...currentCard, ...updates };
      wx.setStorageSync('businessCard', updatedCard);
      return true;
    }
    
    const currentCard = wx.getStorageSync('businessCard') || {};
    const updatedCard = { ...currentCard, ...updates };
    wx.setStorageSync('businessCard', updatedCard);
    return true;
  } catch (error) {
    console.error('更新个人名片失败:', error);
    const currentCard = wx.getStorageSync('businessCard') || {};
    const updatedCard = { ...currentCard, ...updates };
    wx.setStorageSync('businessCard', updatedCard);
    return true;
  }
};

export const searchBusinessCards = async (query) => {
  try {
    const response = await wx.request({
      url: `${API_BASE_URL}/api/business-card/list/search`,
      method: 'GET',
      data: query,
      timeout: 10000
    });
    
    if (response.data && response.data.code === 200) {
      return response.data.data || [];
    }
    
    return [];
  } catch (error) {
    console.error('搜索个人名片失败:', error);
    return [];
  }
};

export const getRecommendBusinessCards = async (userId) => {
  try {
    const userIdNum = parseInt(userId);
    const response = await wx.request({
      url: `${API_BASE_URL}/api/business-card/list/recommend`,
      method: 'GET',
      data: { userId: userIdNum },
      timeout: 10000
    });
    
    if (response.data && response.data.code === 200) {
      return response.data.data || [];
    }
    
    return [];
  } catch (error) {
    console.error('获取推荐名片失败:', error);
    return [];
  }
};
