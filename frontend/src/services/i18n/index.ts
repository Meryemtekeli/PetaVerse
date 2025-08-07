import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  tr: {
    translation: {
      // Genel
      'welcome': 'Hoş Geldiniz',
      'login': 'Giriş Yap',
      'register': 'Kayıt Ol',
      'logout': 'Çıkış Yap',
      'search': 'Ara',
      'save': 'Kaydet',
      'cancel': 'İptal',
      'delete': 'Sil',
      'edit': 'Düzenle',
      'create': 'Oluştur',
      'loading': 'Yükleniyor...',
      'error': 'Hata',
      'success': 'Başarılı',
      
      // Navigasyon
      'home': 'Ana Sayfa',
      'dashboard': 'Dashboard',
      'profile': 'Profil',
      'pets': 'Evcil Hayvanlar',
      'adoption': 'Sahiplendirme',
      'lostPets': 'Kayıp Hayvanlar',
      'veterinarians': 'Veterinerler',
      'community': 'Topluluk',
      'calendar': 'Takvim',
      'shop': 'Mağaza',
      'badges': 'Rozetler',
      'admin': 'Admin',
      
      // Evcil Hayvan
      'petName': 'Hayvan Adı',
      'petType': 'Hayvan Türü',
      'breed': 'Irk',
      'age': 'Yaş',
      'gender': 'Cinsiyet',
      'color': 'Renk',
      'weight': 'Ağırlık',
      'description': 'Açıklama',
      'addPet': 'Evcil Hayvan Ekle',
      'editPet': 'Evcil Hayvan Düzenle',
      
      // Sahiplendirme
      'adoptionTitle': 'Sahiplendirme',
      'matingTitle': 'Çiftleştirme',
      'createListing': 'İlan Oluştur',
      'applyForAdoption': 'Sahiplendirme Başvurusu',
      'adoptionFee': 'Sahiplendirme Ücreti',
      'urgent': 'Acil',
      
      // Kayıp Hayvanlar
      'lostPet': 'Kayıp Hayvan',
      'foundPet': 'Bulunan Hayvan',
      'reportLostPet': 'Kayıp Hayvan Bildir',
      'lostDate': 'Kaybolma Tarihi',
      'lostLocation': 'Kaybolma Yeri',
      'contactInfo': 'İletişim Bilgileri',
      
      // Veteriner
      'vetServices': 'Veteriner Hizmetleri',
      'appointment': 'Randevu',
      'rating': 'Puanlama',
      'reviews': 'Yorumlar',
      
      // Topluluk
      'forum': 'Forum',
      'petStory': 'PetStory',
      'createPost': 'Post Oluştur',
      'like': 'Beğen',
      'comment': 'Yorum',
      'follow': 'Takip Et',
      
      // Takvim
      'calendar': 'Takvim',
      'reminders': 'Hatırlatıcılar',
      'vaccine': 'Aşı',
      'medicine': 'İlaç',
      'vetVisit': 'Veteriner Ziyareti',
      'breeding': 'Çiftleştirme',
      'birth': 'Doğum',
      
      // Mağaza
      'shop': 'Mağaza',
      'products': 'Ürünler',
      'sellProduct': 'Ürün Sat',
      'price': 'Fiyat',
      'condition': 'Durum',
      'new': 'Yeni',
      'used': 'Kullanılmış',
      
      // Rozetler
      'badges': 'Rozetler',
      'points': 'Puanlar',
      'level': 'Seviye',
      'achievements': 'Başarılar',
      'leaderboard': 'Lider Tablosu',
      
      // Admin
      'adminPanel': 'Admin Paneli',
      'users': 'Kullanıcılar',
      'moderation': 'Moderasyon',
      'reports': 'Raporlar',
      'settings': 'Ayarlar',
    }
  },
  en: {
    translation: {
      // General
      'welcome': 'Welcome',
      'login': 'Login',
      'register': 'Register',
      'logout': 'Logout',
      'search': 'Search',
      'save': 'Save',
      'cancel': 'Cancel',
      'delete': 'Delete',
      'edit': 'Edit',
      'create': 'Create',
      'loading': 'Loading...',
      'error': 'Error',
      'success': 'Success',
      
      // Navigation
      'home': 'Home',
      'dashboard': 'Dashboard',
      'profile': 'Profile',
      'pets': 'Pets',
      'adoption': 'Adoption',
      'lostPets': 'Lost Pets',
      'veterinarians': 'Veterinarians',
      'community': 'Community',
      'calendar': 'Calendar',
      'shop': 'Shop',
      'badges': 'Badges',
      'admin': 'Admin',
      
      // Pets
      'petName': 'Pet Name',
      'petType': 'Pet Type',
      'breed': 'Breed',
      'age': 'Age',
      'gender': 'Gender',
      'color': 'Color',
      'weight': 'Weight',
      'description': 'Description',
      'addPet': 'Add Pet',
      'editPet': 'Edit Pet',
      
      // Adoption
      'adoptionTitle': 'Adoption',
      'matingTitle': 'Mating',
      'createListing': 'Create Listing',
      'applyForAdoption': 'Apply for Adoption',
      'adoptionFee': 'Adoption Fee',
      'urgent': 'Urgent',
      
      // Lost Pets
      'lostPet': 'Lost Pet',
      'foundPet': 'Found Pet',
      'reportLostPet': 'Report Lost Pet',
      'lostDate': 'Lost Date',
      'lostLocation': 'Lost Location',
      'contactInfo': 'Contact Info',
      
      // Veterinarian
      'vetServices': 'Vet Services',
      'appointment': 'Appointment',
      'rating': 'Rating',
      'reviews': 'Reviews',
      
      // Community
      'forum': 'Forum',
      'petStory': 'PetStory',
      'createPost': 'Create Post',
      'like': 'Like',
      'comment': 'Comment',
      'follow': 'Follow',
      
      // Calendar
      'calendar': 'Calendar',
      'reminders': 'Reminders',
      'vaccine': 'Vaccine',
      'medicine': 'Medicine',
      'vetVisit': 'Vet Visit',
      'breeding': 'Breeding',
      'birth': 'Birth',
      
      // Shop
      'shop': 'Shop',
      'products': 'Products',
      'sellProduct': 'Sell Product',
      'price': 'Price',
      'condition': 'Condition',
      'new': 'New',
      'used': 'Used',
      
      // Badges
      'badges': 'Badges',
      'points': 'Points',
      'level': 'Level',
      'achievements': 'Achievements',
      'leaderboard': 'Leaderboard',
      
      // Admin
      'adminPanel': 'Admin Panel',
      'users': 'Users',
      'moderation': 'Moderation',
      'reports': 'Reports',
      'settings': 'Settings',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'tr', // Varsayılan dil
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 