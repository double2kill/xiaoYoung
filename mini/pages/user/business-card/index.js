import { getCurrentUser } from '../../../services/user/login';
import { getBusinessCard, saveBusinessCard, updateBusinessCard } from '../../../services/business-card/index';
import Toast from 'tdesign-miniprogram/toast/index';

const getDefaultData = () => ({
  businessCard: {
    industry: '',
    profession: '',
    interests: '',
    position: '',
    company: '',
    email: '',
    phone: '',
    wechat: '',
    introduction: ''
  },
  loading: true,
  industryOptions: [
    '互联网/IT',
    '金融/投资',
    '教育/培训',
    '医疗/健康',
    '房地产/建筑',
    '制造业',
    '零售/电商',
    '媒体/广告',
    '法律/咨询',
    '政府/事业单位',
    '其他'
  ],
  professionOptions: [
    '产品经理',
    '软件工程师',
    '设计师',
    '运营',
    '销售',
    '市场',
    '财务',
    '人事',
    '法务',
    '咨询师',
    '教师',
    '医生',
    '律师',
    '其他'
  ],
  positionOptions: [
    '实习生',
    '专员',
    '主管',
    '经理',
    '总监',
    'VP',
    'CEO/创始人',
    '其他'
  ],
  currentUser: null
});

Page({
  data: getDefaultData(),

  onLoad() {
    this.init();
  },

  init() {
    const currentUser = getCurrentUser();
    console.log('init: 获取到的当前用户:', currentUser);
    this.setData({ currentUser });
    
    if (!currentUser) {
      console.log('init: 用户未登录，返回上一页');
      wx.navigateBack();
      return;
    }

    console.log('init: 用户已登录，开始加载名片数据');
    this.loadBusinessCard();
  },

  async loadBusinessCard() {
    const currentUser = this.data.currentUser;
    if (!currentUser) {
      console.log('loadBusinessCard: 用户未登录');
      return;
    }
    
    console.log('loadBusinessCard: 开始加载名片数据，用户ID:', currentUser.id, '类型:', typeof currentUser.id);
    
    try {
      const businessCard = await getBusinessCard(currentUser.id);
      console.log('loadBusinessCard: 获取到的名片数据:', businessCard);
      
      const finalCard = {
        ...businessCard,
        nickName: currentUser?.username || '',
        avatarUrl: currentUser?.avatarUrl || ''
      };
      
      console.log('loadBusinessCard: 最终设置的名片数据:', finalCard);
      
      this.setData({ 
        businessCard: finalCard,
        loading: false
      });
      
      console.log('loadBusinessCard: 数据设置完成，当前页面数据:', this.data.businessCard);
    } catch (error) {
      console.error('加载个人名片失败:', error);
      const localCard = wx.getStorageSync('businessCard') || this.data.businessCard;
      this.setData({ 
        businessCard: {
          ...localCard,
          nickName: currentUser?.username || '',
          avatarUrl: currentUser?.avatarUrl || ''
        },
        loading: false
      });
    }
  },

  onIndustryChange(e) {
    const { value } = e.detail;
    this.setData({
      'businessCard.industry': this.data.industryOptions[value]
    });
  },

  onProfessionChange(e) {
    const { value } = e.detail;
    this.setData({
      'businessCard.profession': this.data.professionOptions[value]
    });
  },

  onPositionChange(e) {
    const { value } = e.detail;
    this.setData({
      'businessCard.position': this.data.positionOptions[value]
    });
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`businessCard.${field}`]: value
    });
  },

  async onSave() {
    const { businessCard, currentUser } = this.data;
    
    if (!businessCard.industry || !businessCard.profession || !businessCard.position) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '请填写行业、专业和职位信息',
        icon: 'error',
        duration: 2000,
      });
      return;
    }

    if (!currentUser) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '用户信息不存在',
        icon: 'error',
        duration: 2000,
      });
      return;
    }

    try {
      const success = await saveBusinessCard(businessCard, currentUser.id);
      
      if (success) {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '保存成功',
          icon: 'success',
          duration: 1500,
        });
        
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '保存失败，请重试',
          icon: 'error',
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('保存个人名片失败:', error);
      Toast({
        context: this,
        selector: '#t-toast',
        message: '保存失败，请重试',
        icon: 'error',
        duration: 2000,
      });
    }
  },

});
