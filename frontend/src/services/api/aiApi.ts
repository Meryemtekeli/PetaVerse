// AI destekli öneri ve moderasyon için mock API
// Gerçek AI entegrasyonu için bu fonksiyonlar güncellenebilir

export interface AIMatch {
  score: number;
  reason: string;
  suggestedListingId: string;
}

export const getAIMatches = async (petId: string): Promise<AIMatch[]> => {
  // Mock AI eşleştirme sonuçları
  return [
    {
      score: 0.85,
      reason: "Benzer yaş ve tür uyumu",
      suggestedListingId: "listing1"
    },
    {
      score: 0.72,
      reason: "Aynı şehirde bulunuyor",
      suggestedListingId: "listing2"
    }
  ];
};

export const moderateContent = async (content: string): Promise<{ isAppropriate: boolean; reason?: string }> => {
  // Mock içerik moderasyonu
  const inappropriateWords = ['kötü', 'yasak', 'tehlikeli'];
  const hasInappropriate = inappropriateWords.some(word => content.toLowerCase().includes(word));
  
  return {
    isAppropriate: !hasInappropriate,
    reason: hasInappropriate ? "Uygunsuz içerik tespit edildi" : undefined
  };
};

export const generateContract = async (adoptionData: any): Promise<string> => {
  // Mock dijital sözleşme oluşturma
  return `
    SAHİPLENDİRME SÖZLEŞMESİ
    
    Taraflar:
    Sahip: ${adoptionData.ownerName}
    Yeni Sahip: ${adoptionData.newOwnerName}
    Evcil Hayvan: ${adoptionData.petName}
    
    Bu sözleşme ile evcil hayvan sahiplendirme işlemi gerçekleştirilmiştir.
    
    Tarih: ${new Date().toLocaleDateString()}
  `;
}; 