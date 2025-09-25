import { request } from '../_utils/request';

export const fetchGroupsList = () => {
  return request({
    url: '/api/groups',
    method: 'GET',
  });
};

export const fetchGroupDetail = (id) => {
  return request({
    url: `/api/groups/${id}`,
    method: 'GET',
  });
};

export const joinGroup = (id, data) => {
  return request({
    url: `/api/groups/${id}/join`,
    method: 'POST',
    data,
  });
};
