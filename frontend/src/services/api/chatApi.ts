import { apiClient } from './apiClient';

export interface ChatMessage {
  id: number;
  content: string;
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  receiverId: number;
  receiverName: string;
  receiverAvatar?: string;
  adoptionListingId: number;
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  status: 'SENT' | 'DELIVERED' | 'READ';
  timestamp: string;
  isRead: boolean;
}

export interface ChatRoom {
  id: number;
  name: string;
  adoptionListingId: number;
  adoptionListingTitle: string;
  adoptionListingImage?: string;
  ownerId: number;
  ownerName: string;
  ownerAvatar?: string;
  interestedUserId: number;
  interestedUserName: string;
  interestedUserAvatar?: string;
  lastMessageTime?: string;
  lastMessage?: string;
  unreadCount: number;
  createdAt: string;
  isActive: boolean;
  recentMessages?: ChatMessage[];
}

export const chatApi = {
  // Create or get chat room
  createOrGetChatRoom: async (adoptionListingId: number, interestedUserId: number): Promise<ChatRoom> => {
    const response = await apiClient.post('/chat/rooms', null, {
      params: { adoptionListingId, interestedUserId }
    });
    return response.data;
  },

  // Get user's chat rooms
  getUserChatRooms: async (userId: number): Promise<ChatRoom[]> => {
    const response = await apiClient.get('/chat/rooms', {
      params: { userId }
    });
    return response.data;
  },

  // Get chat room messages
  getChatRoomMessages: async (chatRoomId: number, userId: number): Promise<ChatMessage[]> => {
    const response = await apiClient.get(`/chat/rooms/${chatRoomId}/messages`, {
      params: { userId }
    });
    return response.data;
  },

  // Mark messages as read
  markMessagesAsRead: async (chatRoomId: number, userId: number): Promise<void> => {
    await apiClient.post(`/chat/rooms/${chatRoomId}/read`, null, {
      params: { userId }
    });
  },

  // Send message (for REST API fallback)
  sendMessage: async (chatRoomId: number, content: string, senderId: number): Promise<ChatMessage> => {
    const response = await apiClient.post(`/chat/rooms/${chatRoomId}/messages`, {
      content,
      senderId
    });
    return response.data;
  }
};
