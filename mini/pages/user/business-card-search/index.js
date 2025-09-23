import { searchBusinessCards, getRecommendBusinessCards } from '../../../services/business-card/index';
import { getCurrentUser } from '../../../services/user/login';
import Toast from 'tdesign-miniprogram/toast/index';

const getDefaultData = () => ({
  searchResults: [],
  recommendCards: [],
  searchQuery: {
    industry: '',
    profession: '',
    position: '',
    keyword: ''
  },
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
  currentUser: null,
  activeTab: 'recommend'
});

Page({
  data: getDefaultData(),

  onLoad() {
    this.init();
  },

  init() {
    const currentUser = getCurrentUser();
    this.setData({ currentUser });
    this.loadRecommendCards();
  },

  async loadRecommendCards() {
    const { currentUser } = this.data;
    if (!currentUser) return;

    try {
      const recommendCards = await getRecommendBusinessCards(currentUser.id);
      this.setData({ recommendCards });
    } catch (error) {
      console.error('加载推荐名片失败:', error);
    }
  },

  async onSearch() {
    const { searchQuery } = this.data;
    
    try {
      const searchResults = await searchBusinessCards(searchQuery);
      this.setData({ 
        searchResults,
        activeTab: 'search'
      });
    } catch (error) {
      console.error('搜索名片失败:', error);
      Toast({
        context: this,
        selector: '#t-toast',
        message: '搜索失败，请重试',
        icon: 'error',
        duration: 2000,
      });
    }
  },

  onIndustryChange(e) {
    const { value } = e.detail;
    this.setData({
      'searchQuery.industry': this.data.industryOptions[value]
    });
  },

  onProfessionChange(e) {
    const { value } = e.detail;
    this.setData({
      'searchQuery.profession': this.data.professionOptions[value]
    });
  },

  onPositionChange(e) {
    const { value } = e.detail;
    this.setData({
      'searchQuery.position': this.data.positionOptions[value]
    });
  },

  onKeywordInput(e) {
    this.setData({
      'searchQuery.keyword': e.detail.value
    });
  },

  onTabChange(e) {
    const { value } = e.detail;
    this.setData({ activeTab: value });
    
    if (value === 'recommend') {
      this.loadRecommendCards();
    }
  },

  onCardClick(e) {
    const { card } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/user/business-card-detail/index?data=${encodeURIComponent(JSON.stringify(card))}`
    });
  },

  onClearSearch() {
    this.setData({
      searchQuery: {
        industry: '',
        profession: '',
        position: '',
        keyword: ''
      },
      searchResults: [],
      activeTab: 'recommend'
    });
  }
});
