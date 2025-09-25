import { request } from '@umijs/max';

export interface GroupItem {
  _id: string;
  name: string;
  description: string;
  groupType: string;
  createdBy: string;
  status: 'pending' | 'approved' | 'rejected';
  members: Array<{
    userId: string;
    role: 'admin' | 'member';
    status: 'approved' | 'pending';
    joinedAt: string;
  }>;
  createdAt: string;
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

export async function getGroupsList(): Promise<ApiResponse<GroupItem[]>> {
  return request('/admin/groups');
}

export async function getGroupDetail(
  id: string,
): Promise<ApiResponse<GroupItem>> {
  return request(`/admin/groups/${id}`);
}

export async function createGroup(
  data: Partial<GroupItem>,
): Promise<ApiResponse<any>> {
  return request('/admin/groups', {
    method: 'POST',
    data,
  });
}

export async function updateGroup(
  id: string,
  data: Partial<GroupItem>,
): Promise<ApiResponse<any>> {
  return request(`/admin/groups/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteGroup(id: string): Promise<ApiResponse<any>> {
  return request(`/admin/groups/${id}`, {
    method: 'DELETE',
  });
}

export async function joinGroup(
  id: string,
  data: { userId: string; role?: 'admin' | 'member' },
): Promise<ApiResponse<any>> {
  return request(`/admin/groups/${id}/join`, {
    method: 'POST',
    data,
  });
}

export async function approveMember(
  id: string,
  data: { userId: string },
): Promise<ApiResponse<any>> {
  return request(`/admin/groups/${id}/approve-member`, {
    method: 'POST',
    data,
  });
}

export async function updateGroupStatus(
  id: string,
  data: { status: 'pending' | 'approved' | 'rejected' },
): Promise<ApiResponse<any>> {
  return request(`/admin/groups/${id}/status`, {
    method: 'PUT',
    data,
  });
}

export interface GroupMemberItem {
  _id: string;
  groupId: string;
  userId: {
    _id: string;
    name: string;
    username: string;
    email: string;
    avatar?: string;
    company?: string;
    position?: string;
  };
  role: 'admin' | 'member';
  status: 'approved' | 'pending' | 'rejected';
  joinedAt: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getGroupMembers(
  id: string,
): Promise<ApiResponse<GroupMemberItem[]>> {
  return request(`/admin/groups/${id}/members`);
}

export async function addGroupMember(
  id: string,
  data: { userId: string; role?: 'admin' | 'member' },
): Promise<ApiResponse<GroupMemberItem>> {
  return request(`/admin/groups/${id}/members`, {
    method: 'POST',
    data,
  });
}

export async function updateMemberStatus(
  id: string,
  userId: string,
  data: { status: 'approved' | 'rejected' },
): Promise<ApiResponse<GroupMemberItem>> {
  return request(`/admin/groups/${id}/members/${userId}/status`, {
    method: 'PUT',
    data,
  });
}

export async function removeGroupMember(
  id: string,
  userId: string,
): Promise<ApiResponse<any>> {
  return request(`/admin/groups/${id}/members/${userId}`, {
    method: 'DELETE',
  });
}

export interface UserItem {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  company?: string;
  position?: string;
}

export async function getUserList(): Promise<ApiResponse<UserItem[]>> {
  return request('/admin/user-list');
}
