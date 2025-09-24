import { request } from '@umijs/max';

export interface CommunityItem {
  id: string;
  name: string;
  memberCount: number;
  rating: boolean[];
  contactName: string;
  contactPhone: string;
  description: string;
  createTime: string;
  lastActiveTime: string;
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

export async function getCommunityList(): Promise<
  ApiResponse<CommunityItem[]>
> {
  return request('/admin/community');
}

export async function getCommunityDetail(
  id: string,
): Promise<ApiResponse<CommunityItem>> {
  return request(`/admin/community/${id}`);
}

export async function createCommunity(
  data: Partial<CommunityItem>,
): Promise<ApiResponse<any>> {
  return request('/admin/community', {
    method: 'POST',
    data,
  });
}

export async function updateCommunity(
  id: string,
  data: Partial<CommunityItem>,
): Promise<ApiResponse<any>> {
  return request(`/admin/community/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteCommunity(id: string): Promise<ApiResponse<any>> {
  return request(`/admin/community/${id}`, {
    method: 'DELETE',
  });
}
