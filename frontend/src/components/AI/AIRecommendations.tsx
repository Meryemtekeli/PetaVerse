import React, { useState, useEffect } from 'react';
import { aiApi, AdoptionRecommendation } from '../../services/api/aiApi';
import { useAuth } from '../../store/slices/authSlice';
import { PetMatchCard } from './PetMatchCard';
import { SparklesIcon } from '@heroicons/react/24/outline';

export const AIRecommendations: React.FC = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<AdoptionRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadRecommendations();
    }
  }, [user?.id]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await aiApi.getAdoptionRecommendations(user!.id);
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to load AI recommendations:', error);
      setError('AI önerileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (recommendation: AdoptionRecommendation) => {
    console.log('Liked recommendation:', recommendation);
    // TODO: Implement like functionality
  };

  const handleContact = (recommendation: AdoptionRecommendation) => {
    console.log('Contact recommendation:', recommendation);
    // TODO: Navigate to chat or contact form
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">AI önerileri hazırlanıyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-4xl mb-2">🤖</div>
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadRecommendations}
          className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-8">
        <SparklesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz öneri yok</h3>
        <p className="text-gray-600">
          Profil bilgilerinizi güncelleyerek daha iyi öneriler alabilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <SparklesIcon className="h-6 w-6 text-purple-600 mr-2" />
            AI Önerileri
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Size özel olarak seçilmiş {recommendations.length} öneri
          </p>
        </div>
        <button
          onClick={loadRecommendations}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Yenile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((recommendation) => (
          <PetMatchCard
            key={recommendation.pet.id}
            match={{
              pet: recommendation.pet,
              adoptionListing: recommendation.adoptionListing,
              compatibilityScore: recommendation.compatibilityScore,
              matchReasons: recommendation.recommendationReasons,
              distance: 0 // Distance not available in recommendations
            }}
            onLike={() => handleLike(recommendation)}
            onContact={() => handleContact(recommendation)}
          />
        ))}
      </div>
    </div>
  );
};
