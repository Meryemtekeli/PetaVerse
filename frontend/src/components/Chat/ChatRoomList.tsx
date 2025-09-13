import React, { useEffect, useState } from 'react';
import { chatApi, ChatRoom } from '../../services/api/chatApi';
import { useAuth } from '../../store/slices/authSlice';

interface ChatRoomListProps {
  onSelectRoom: (room: ChatRoom) => void;
  selectedRoomId?: number;
}

export const ChatRoomList: React.FC<ChatRoomListProps> = ({ onSelectRoom, selectedRoomId }) => {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadChatRooms();
    }
  }, [user?.id]);

  const loadChatRooms = async () => {
    try {
      setLoading(true);
      const rooms = await chatApi.getUserChatRooms(user!.id);
      setChatRooms(rooms);
    } catch (error) {
      console.error('Failed to load chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Sohbetler</h3>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {chatRooms.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Henüz sohbet yok
          </div>
        ) : (
          chatRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => onSelectRoom(room)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedRoomId === room.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {room.adoptionListingImage ? (
                    <img
                      src={room.adoptionListingImage}
                      alt={room.adoptionListingTitle}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">🐾</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {room.adoptionListingTitle}
                    </h4>
                    {room.unreadCount > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {room.unreadCount}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate">
                    {room.ownerId === user?.id ? room.interestedUserName : room.ownerName}
                  </p>
                  
                  {room.lastMessage && (
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {room.lastMessage}
                    </p>
                  )}
                  
                  {room.lastMessageTime && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(room.lastMessageTime).toLocaleDateString('tr-TR')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
