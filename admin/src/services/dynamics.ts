import { request } from '@umijs/max';

export interface DynamicItem {
  _id: string;
  content: string;
  authorId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  groupId?: {
    _id: string;
    name: string;
  };
  images?: string[];
  likes: number;
  comments: number;
  shares: number;
  likedBy: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

export async function getDynamicsList(params?: {
  groupId?: string;
  authorId?: string;
  status?: string;
}): Promise<ApiResponse<DynamicItem[]>> {
  return request('/admin/dynamics', {
    params,
  });
}

export async function getDynamicDetail(
  id: string,
): Promise<ApiResponse<DynamicItem>> {
  return request(`/admin/dynamics/${id}`);
}

export async function createDynamic(
  data: Partial<DynamicItem>,
): Promise<ApiResponse<any>> {
  return request('/admin/dynamics', {
    method: 'POST',
    data,
  });
}

export async function updateDynamic(
  id: string,
  data: Partial<DynamicItem>,
): Promise<ApiResponse<any>> {
  return request(`/admin/dynamics/${id}`, {
    method: 'PATCH',
    data,
  });
}

export async function deleteDynamic(id: string): Promise<ApiResponse<any>> {
  return request(`/admin/dynamics/${id}`, {
    method: 'DELETE',
  });
}

export async function likeDynamic(
  id: string,
  data: { userId: string },
): Promise<ApiResponse<any>> {
  return request(`/admin/dynamics/${id}/like`, {
    method: 'POST',
    data,
  });
}

export async function getDynamicsByUser(
  userId: string,
): Promise<ApiResponse<DynamicItem[]>> {
  return request(`/admin/dynamics/user/${userId}`);
}
