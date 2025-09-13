import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseWebSocketProps {
  url: string;
  token?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMessage?: (message: any) => void;
}

export const useWebSocket = ({
  url,
  token,
  onConnect,
  onDisconnect,
  onMessage
}: UseWebSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    // Create socket connection
    socketRef.current = io(url, {
      auth: {
        token: `Bearer ${token}`
      },
      transports: ['websocket', 'polling']
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      onConnect?.();
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      onDisconnect?.();
    });

    socket.on('connect_error', (err) => {
      setError(err.message);
      setIsConnected(false);
    });

    // Message handlers
    socket.on('message', (data) => {
      onMessage?.(data);
    });

    socket.on('chat_message', (data) => {
      onMessage?.(data);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [url, token, onConnect, onDisconnect, onMessage]);

  const sendMessage = (event: string, data: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    }
  };

  const joinRoom = (roomId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join_room', roomId);
    }
  };

  const leaveRoom = (roomId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('leave_room', roomId);
    }
  };

  return {
    isConnected,
    error,
    sendMessage,
    joinRoom,
    leaveRoom,
    socket: socketRef.current
  };
};
