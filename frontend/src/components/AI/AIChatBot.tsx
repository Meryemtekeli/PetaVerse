import React, { useState, useRef, useEffect } from 'react';
import { aiApi, ChatBotResponse } from '../../services/api/aiApi';
import { useAuth } from '../../store/slices/authSlice';
import { PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  suggestedActions?: string[];
}

export const AIChatBot: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Merhaba! Ben PetaVerse AI asistanınız. Size nasıl yardımcı olabilirim?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user?.id || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response: ChatBotResponse = await aiApi.generateChatBotResponse(inputMessage, user.id);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        isUser: false,
        timestamp: new Date(),
        suggestedActions: response.suggestedActions
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Üzgünüm, şu anda bir hata oluştu. Lütfen tekrar deneyin.',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedAction = (action: string) => {
    setInputMessage(action);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border h-96 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
        <div className="flex items-center">
          <SparklesIcon className="h-6 w-6 mr-2" />
          <div>
            <h3 className="font-semibold">AI Asistan</h3>
            <p className="text-sm opacity-90">Size yardımcı olmaya hazır</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isUser
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.isUser ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString('tr-TR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              
              {/* Suggested Actions */}
              {message.suggestedActions && message.suggestedActions.length > 0 && (
                <div className="mt-2 space-y-1">
                  {message.suggestedActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedAction(action)}
                      className="block w-full text-left text-xs bg-white bg-opacity-20 hover:bg-opacity-30 rounded px-2 py-1 transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span className="text-sm">Düşünüyor...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mesajınızı yazın..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
