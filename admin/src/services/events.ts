import { request } from '@umijs/max';

export interface EventItem {
  _id: string;
  groupId: {
    _id: string;
    name: string;
  };
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  requirements?: string;
  safetyNotice?: string;
  feeInfo?: string;
  deadline: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  tags?: string[];
  participants: Array<{
    userId: {
      _id: string;
      name: string;
      email: string;
    };
    status: 'pending' | 'approved' | 'rejected';
    joinedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

export async function getEventsList(params?: {
  groupId?: string;
  status?: string;
}): Promise<ApiResponse<EventItem[]>> {
  return request('/admin/events', {
    params,
  });
}

export async function getEventDetail(
  id: string,
): Promise<ApiResponse<EventItem>> {
  return request(`/admin/events/${id}`);
}

export async function createEvent(
  data: Partial<EventItem>,
): Promise<ApiResponse<any>> {
  return request('/admin/events', {
    method: 'POST',
    data,
  });
}

export async function updateEvent(
  id: string,
  data: Partial<EventItem>,
): Promise<ApiResponse<any>> {
  return request(`/admin/events/${id}`, {
    method: 'PATCH',
    data,
  });
}

export async function deleteEvent(id: string): Promise<ApiResponse<any>> {
  return request(`/admin/events/${id}`, {
    method: 'DELETE',
  });
}

export async function updateEventStatus(
  id: string,
  data: { status: 'pending' | 'approved' | 'rejected' },
): Promise<ApiResponse<any>> {
  return request(`/admin/events/${id}`, {
    method: 'PATCH',
    data,
  });
}

export async function joinEvent(
  id: string,
  data: { userId: string; status?: 'pending' | 'approved' | 'rejected' },
): Promise<ApiResponse<any>> {
  return request(`/admin/events/${id}/join`, {
    method: 'POST',
    data,
  });
}

export async function updateParticipantStatus(
  eventId: string,
  userId: string,
  data: { status: 'pending' | 'approved' | 'rejected' },
): Promise<ApiResponse<any>> {
  return request(`/admin/events/${eventId}/participants/${userId}/status`, {
    method: 'PATCH',
    data,
  });
}

export async function removeParticipant(
  eventId: string,
  userId: string,
): Promise<ApiResponse<any>> {
  return request(`/admin/events/${eventId}/participants/${userId}`, {
    method: 'DELETE',
  });
}

export async function getEventsByUser(
  userId: string,
): Promise<ApiResponse<EventItem[]>> {
  return request(`/admin/events/user/${userId}`);
}
