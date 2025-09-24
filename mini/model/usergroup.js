import { fetchCommunityList, fetchCommunityDetail, joinCommunity } from '../services/community/index';

export const getUserGroupList = fetchCommunityList;

export const getUserGroupDetail = fetchCommunityDetail;

export const joinUserGroup = joinCommunity;
