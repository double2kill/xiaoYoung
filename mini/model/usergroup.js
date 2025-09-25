import { fetchGroupsList, fetchGroupDetail, joinGroup } from '../services/groups/index';

export const getUserGroupList = fetchGroupsList;

export const getUserGroupDetail = fetchGroupDetail;

export const joinUserGroup = joinGroup;
