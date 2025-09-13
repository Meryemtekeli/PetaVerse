import React, { useState } from 'react';
import { ChatRoomList } from './ChatRoomList';
import { ChatWindow } from './ChatWindow';
import { ChatRoom } from '../../services/api/chatApi';

export const ChatPage: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);

  const handleSelectRoom = (room: ChatRoom) => {
    setSelectedRoom(room);
  };

  const handleCloseChat = () => {
    setSelectedRoom(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mesajlar</h1>
          <p className="mt-2 text-gray-600">
            Sahiplendirme sürecinde diğer kullanıcılarla iletişim kurun
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Room List */}
          <div className="lg:col-span-1">
            <ChatRoomList
              onSelectRoom={handleSelectRoom}
              selectedRoomId={selectedRoom?.id}
            />
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            {selectedRoom ? (
              <ChatWindow
                chatRoom={selectedRoom}
                onClose={handleCloseChat}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border h-96 flex items-center justify-center">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Sohbet Seçin</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Başlamak için sol taraftan bir sohbet seçin
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
