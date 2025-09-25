import { request } from '@umijs/max';

export interface MessageItem {
  _id: string;
  senderId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  receiverId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  content: string;
  type: string;
  attachments?: string[];
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationItem {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  lastMessage: MessageItem;
  unreadCount: number;
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

export async function getMessagesList(params?: {
  userId?: string;
  conversationId?: string;
  isRead?: boolean;
}): Promise<ApiResponse<MessageItem[]>> {
  return request('/messages', {
    params,
  });
}

export async function getMessageDetail(
  id: string,
): Promise<ApiResponse<MessageItem>> {
  return request(`/messages/${id}`);
}

export async function createMessage(
  data: Partial<MessageItem>,
): Promise<ApiResponse<any>> {
  return request('/messages', {
    method: 'POST',
    data,
  });
}

export async function updateMessage(
  id: string,
  data: Partial<MessageItem>,
): Promise<ApiResponse<any>> {
  return request(`/messages/${id}`, {
    method: 'PATCH',
    data,
  });
}

export async function deleteMessage(id: string): Promise<ApiResponse<any>> {
  return request(`/messages/${id}`, {
    method: 'DELETE',
  });
}

export async function markAsRead(
  id: string,
  data: { userId: string },
): Promise<ApiResponse<any>> {
  return request(`/messages/${id}/read`, {
    method: 'PATCH',
    data,
  });
}

export async function markAllAsRead(userId: string): Promise<ApiResponse<any>> {
  return request(`/messages/read-all/${userId}`, {
    method: 'PATCH',
  });
}

export async function getConversations(
  userId: string,
): Promise<ApiResponse<ConversationItem[]>> {
  return request(`/messages/conversations/${userId}`);
}

export async function getUnreadCount(
  userId: string,
): Promise<ApiResponse<number>> {
  return request(`/messages/unread-count/${userId}`);
}
