import { request } from '../_utils/request';

export const fetchCommunityList = () => {
  return request({
    url: '/api/community',
    method: 'GET',
  });
};

export const fetchCommunityDetail = (id) => {
  return request({
    url: `/api/community/${id}`,
    method: 'GET',
  });
};

export const joinCommunity = (id) => {
  return request({
    url: `/api/community/${id}/join`,
    method: 'POST',
  });
};
