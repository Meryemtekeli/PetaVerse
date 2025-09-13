import React, { useState } from 'react';
import { AIRecommendations } from '../../components/AI/AIRecommendations';
import { AIChatBot } from '../../components/AI/AIChatBot';
import { 
  SparklesIcon, 
  ChatBubbleLeftIcon, 
  HeartIcon,
  MagnifyingGlassIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export const AIDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'chatbot' | 'search'>('recommendations');

  const tabs = [
    {
      id: 'recommendations' as const,
      name: 'AI Önerileri',
      icon: HeartIcon,
      description: 'Size özel pet eşleştirmeleri'
    },
    {
      id: 'chatbot' as const,
      name: 'AI Asistan',
      icon: ChatBubbleLeftIcon,
      description: 'Soru sorun, yardım alın'
    },
    {
      id: 'search' as const,
      name: 'Akıllı Arama',
      icon: MagnifyingGlassIcon,
      description: 'Doğal dil ile arama yapın'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <SparklesIcon className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Destekli Özellikler</h1>
              <p className="mt-2 text-gray-600">
                Yapay zeka ile daha iyi pet eşleştirmeleri ve deneyimler
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <HeartIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">AI Eşleştirmeleri</p>
                <p className="text-2xl font-semibold text-gray-900">%95</p>
                <p className="text-sm text-green-600">Doğruluk oranı</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ChatBubbleLeftIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">AI Asistan</p>
                <p className="text-2xl font-semibold text-gray-900">24/7</p>
                <p className="text-sm text-blue-600">Her zaman hazır</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Başarılı Eşleştirme</p>
                <p className="text-2xl font-semibold text-gray-900">1,247</p>
                <p className="text-sm text-green-600">Bu ay</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'recommendations' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Size Özel Pet Önerileri
                  </h2>
                  <p className="text-gray-600">
                    AI algoritmamız, tercihlerinizi ve geçmiş aktivitelerinizi analiz ederek 
                    size en uygun pet eşleştirmelerini sunar.
                  </p>
                </div>
                <AIRecommendations />
              </div>
            )}

            {activeTab === 'chatbot' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    AI Asistan ile Sohbet
                  </h2>
                  <p className="text-gray-600">
                    Sahiplendirme süreci, pet bakımı veya platform kullanımı hakkında 
                    sorularınızı sorabilirsiniz.
                  </p>
                </div>
                <AIChatBot />
              </div>
            )}

            {activeTab === 'search' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Akıllı Arama
                  </h2>
                  <p className="text-gray-600">
                    Doğal dil kullanarak pet arayabilirsiniz. "Yavru Golden Retriever" 
                    veya "Sakin kedi" gibi ifadeler kullanın.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Örnek: Yavru köpek, sakin kedi, büyük ırk köpek..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      <MagnifyingGlassIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <p className="font-medium mb-2">Örnek aramalar:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Yavru Golden Retriever',
                        'Sakin kedi',
                        'Büyük ırk köpek',
                        'Evde bakılabilir pet',
                        'Çocuklu aile için uygun'
                      ].map((example, index) => (
                        <button
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Features Info */}
        <div className="mt-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-6 text-white">
          <div className="flex items-center mb-4">
            <SparklesIcon className="h-8 w-8 mr-3" />
            <h3 className="text-xl font-semibold">AI Nasıl Çalışır?</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">1. Analiz</h4>
              <p className="text-sm opacity-90">
                Tercihlerinizi, geçmiş aktivitelerinizi ve profil bilgilerinizi analiz ederiz.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Eşleştirme</h4>
              <p className="text-sm opacity-90">
                Gelişmiş algoritmalar ile en uygun pet eşleştirmelerini buluruz.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Öneri</h4>
              <p className="text-sm opacity-90">
                Size özel öneriler sunar ve başarı oranını sürekli iyileştiririz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
