import { fetchGroupsList, fetchGroupDetail, joinGroup, getGroupEvents, getGroupDynamics } from '../services/groups/index';

export const getUserGroupList = fetchGroupsList;

export const getUserGroupDetail = fetchGroupDetail;

export const joinUserGroup = joinGroup;

export const getUserGroupEvents = getGroupEvents;

export const getUserGroupDynamics = getGroupDynamics;
