import React, { useEffect, useRef, useState } from 'react';
import { chatApi, ChatMessage, ChatRoom } from '../../services/api/chatApi';
import { useAuth } from '../../store/slices/authSlice';
import { useWebSocket } from '../../hooks/useWebSocket';

interface ChatWindowProps {
  chatRoom: ChatRoom;
  onClose: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chatRoom, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { sendMessage, joinRoom, leaveRoom } = useWebSocket({
    url: process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws',
    token: localStorage.getItem('token'),
    onMessage: (message: ChatMessage) => {
      if (message.adoptionListingId === chatRoom.adoptionListingId) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
    }
  });

  useEffect(() => {
    if (chatRoom.id) {
      loadMessages();
      joinRoom(`chat_${chatRoom.id}`);
    }

    return () => {
      if (chatRoom.id) {
        leaveRoom(`chat_${chatRoom.id}`);
      }
    };
  }, [chatRoom.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const chatMessages = await chatApi.getChatRoomMessages(chatRoom.id, user!.id);
      setMessages(chatMessages);
      
      // Mark messages as read
      await chatApi.markMessagesAsRead(chatRoom.id, user!.id);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      // Send via WebSocket
      sendMessage('chat_message', {
        chatRoomId: chatRoom.id,
        content: newMessage,
        senderId: user.id,
        adoptionListingId: chatRoom.adoptionListingId
      });

      // Also send via REST API as fallback
      const message = await chatApi.sendMessage(chatRoom.id, newMessage, user.id);
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-96 bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-3">
          {chatRoom.adoptionListingImage && (
            <img
              src={chatRoom.adoptionListingImage}
              alt={chatRoom.adoptionListingTitle}
              className="w-10 h-10 rounded-lg object-cover"
            />
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{chatRoom.adoptionListingTitle}</h3>
            <p className="text-sm text-gray-600">
              {chatRoom.ownerId === user?.id ? chatRoom.interestedUserName : chatRoom.ownerName}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.senderId === user?.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};
