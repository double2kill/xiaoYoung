const searchHistory = [
  '校友会活动',
  '创业基金',
  '招聘信息',
  '导师制度',
  '企业合作'
];

const hotSearchKeywords = [
  '校友会活动',
  '创业基金申请',
  '企业招聘',
  '导师制度',
  '合作交流',
  '返校日',
  '理事会',
  '青年分会'
];

const searchSuggestions = [
  '校友会活动',
  '校友会活动通知',
  '校友会年度活动',
  '创业基金',
  '创业基金申请',
  '创业基金指南',
  '招聘信息',
  '校友企业招聘',
  '招聘信息汇总',
  '导师制度',
  '校友导师',
  '导师制度倡议',
  '企业合作',
  '企业合作交流',
  '合作座谈会'
];

const searchModel = {
  getSearchHistory() {
    return searchHistory;
  },

  addSearchHistory(keyword) {
    if (!keyword || keyword.trim() === '') return;
    
    const trimmedKeyword = keyword.trim();
    const existingIndex = searchHistory.indexOf(trimmedKeyword);
    
    if (existingIndex > -1) {
      searchHistory.splice(existingIndex, 1);
    }
    
    searchHistory.unshift(trimmedKeyword);
    
    if (searchHistory.length > 10) {
      searchHistory.pop();
    }
  },

  clearSearchHistory() {
    searchHistory.length = 0;
  },

  getHotSearchKeywords() {
    return hotSearchKeywords;
  },

  getSearchSuggestions(keyword) {
    if (!keyword || keyword.trim() === '') {
      return [];
    }
    
    const trimmedKeyword = keyword.trim().toLowerCase();
    return searchSuggestions.filter(item => 
      item.toLowerCase().includes(trimmedKeyword)
    ).slice(0, 8);
  },

  searchAll(keyword) {
    if (!keyword || keyword.trim() === '') {
      return {
        announcements: [],
        userGroups: [],
        total: 0
      };
    }
    
    const trimmedKeyword = keyword.trim();
    
    return {
      announcements: this.searchAnnouncements(trimmedKeyword),
      userGroups: this.searchUserGroups(trimmedKeyword),
      total: 0
    };
  },

  searchAnnouncements(keyword) {
    const announcementData = require('./announcement.js').getAllAnnouncements();
    return announcementData.filter(item => 
      item.title.includes(keyword) || 
      item.content.includes(keyword)
    );
  },

  searchUserGroups(keyword) {
    const userGroupData = require('./usergroup.js');
    return userGroupData.mockUserGroups.filter(item => 
      item.name.includes(keyword) || 
      item.description.includes(keyword)
    );
  }
};

module.exports = searchModel;


