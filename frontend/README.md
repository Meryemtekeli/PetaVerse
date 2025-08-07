# 🐾 PetaVerse - Evcil Hayvan Sahiplendirme ve Yönetim Uygulaması

PetaVerse, evcil hayvan sahiplendirme, kayıp hayvan bildirimi, veteriner hizmetleri ve pet topluluğu için kapsamlı bir platformdur.

## ✨ Özellikler

### 🔐 Kullanıcı Yönetimi
- **Çoklu Kullanıcı Rolleri**: Normal Kullanıcı, Barınak/Dernek, Veteriner, Admin
- **Kolay Kayıt/Giriş**: Firebase Authentication ile güvenli kimlik doğrulama
- **Profil Yönetimi**: Detaylı kullanıcı profilleri ve ayarlar
- **Şifre Sıfırlama**: Güvenli şifre sıfırlama sistemi

### 🐕 Evcil Hayvan Profilleri
- **Gelişmiş Profil Sistemi**: Fotoğraf, video, sağlık kayıtları
- **Sağlık/Aşı Takibi**: Detaylı sağlık geçmişi ve aşı kayıtları
- **Anı Sayfası**: Vefat eden hayvanlar için anı sayfaları
- **Çoklu Medya**: Fotoğraf galerisi ve video desteği

### 🏠 Sahiplendirme ve Çiftleştirme
- **İlan Sistemi**: Sahiplendirme ve çiftleştirme ilanları
- **AI Destekli Eşleştirme**: Akıllı öneri sistemi
- **Başvuru Yönetimi**: Sahiplendirme başvuruları
- **Dijital Sözleşme**: Otomatik sözleşme oluşturma
- **Moderasyon**: Admin onay sistemi

### 🚨 Kayıp Hayvan Bildirimi
- **Harita Entegrasyonu**: Konum bazlı arama
- **Otomatik Bildirimler**: Yakın bölgedeki kullanıcılara bildirim
- **Durum Takibi**: Kayıp, bulundu, birleşti durumları
- **İletişim Bilgileri**: Sahip ile iletişim

### 🏥 Veteriner ve Pet Hizmetleri
- **Hizmet Rehberi**: Veteriner, pet shop, kuaför, eğitmen
- **Randevu Sistemi**: Online randevu alma
- **Puanlama ve Yorumlar**: Kullanıcı değerlendirmeleri
- **Konum Bazlı Arama**: Yakındaki hizmetler

### 👥 Sosyal Alanlar
- **Forum**: Kullanıcı tartışma alanları
- **PetStory**: Evcil hayvan hikayeleri paylaşımı
- **Takip Sistemi**: Kullanıcı takip etme
- **Beğeni ve Yorumlar**: Sosyal etkileşim

### 📅 Hatırlatıcı ve Takvim
- **Aşı Hatırlatıcıları**: Otomatik aşı takibi
- **İlaç Hatırlatıcıları**: İlaç zamanları
- **Veteriner Randevuları**: Randevu takibi
- **Çiftleşme/Doğum**: Üreme takibi

### 🛒 E-ticaret Modülü
- **Pet Ürünleri**: Mama, oyuncak, aksesuar satışı
- **Ödeme Entegrasyonu**: Güvenli ödeme sistemi
- **Kargo Entegrasyonu**: Teslimat takibi
- **Satıcı Paneli**: Ürün yönetimi

### 🏆 Rozet ve Ödül Sistemi
- **Başarı Rozetleri**: Çeşitli aktiviteler için rozetler
- **Puan Sistemi**: Kullanıcı puanları
- **Seviye Sistemi**: Kullanıcı seviyeleri
- **Lider Tablosu**: En aktif kullanıcılar

### 🌍 Çoklu Dil Desteği
- **Türkçe ve İngilizce**: Tam dil desteği
- **i18n Sistemi**: Kolay dil değiştirme
- **Dinamik Çeviri**: Gerçek zamanlı çeviri

### 🤖 AI ve Otomasyon
- **AI Eşleştirme**: Akıllı sahiplendirme önerileri
- **İçerik Moderasyonu**: Otomatik içerik kontrolü
- **Chatbot**: Akıllı müşteri desteği

### 📱 Mobil Uyumluluk
- **Responsive Tasarım**: Tüm cihazlarda uyumlu
- **PWA Desteği**: Progressive Web App
- **Offline Mod**: İnternet olmadan da çalışma

### 🔒 Güvenlik ve Performans
- **JWT Token**: Güvenli kimlik doğrulama
- **SSL Sertifikası**: Şifreli bağlantı
- **Veri Şifreleme**: Hassas veri koruması
- **Performans Optimizasyonu**: Hızlı yükleme

## 🛠️ Teknolojiler

### Frontend
- **React 18**: Modern React kütüphanesi
- **TypeScript**: Tip güvenliği
- **Redux Toolkit**: State yönetimi
- **React Query**: Server state yönetimi
- **React Router**: Sayfa yönlendirme
- **Tailwind CSS**: Utility-first CSS framework
- **Headless UI**: Erişilebilir UI bileşenleri
- **Heroicons**: SVG ikonlar
- **React Hook Form**: Form yönetimi
- **React Hot Toast**: Bildirimler
- **React Map GL**: Harita entegrasyonu
- **Socket.IO Client**: Gerçek zamanlı iletişim

### Backend (Gelecek)
- **Java + Spring Boot**: Güçlü backend framework
- **PostgreSQL**: İlişkisel veritabanı
- **JWT**: Token tabanlı kimlik doğrulama
- **Firebase**: Authentication, Firestore, Cloud Messaging

### DevOps
- **Docker**: Konteynerizasyon
- **CI/CD**: Otomatik deployment
- **Monitoring**: Performans izleme

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Firebase hesabı

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone https://github.com/your-username/petaverse.git
cd petaverse/frontend
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Firebase yapılandırması**
```bash
# Firebase Console'dan config bilgilerini alın
# src/services/firebase.ts dosyasını güncelleyin
```

4. **Uygulamayı başlatın**
```bash
npm start
```

5. **Tarayıcıda açın**
```
http://localhost:3000
```

## 📁 Proje Yapısı

```
frontend/
├── public/
├── src/
│   ├── components/          # Yeniden kullanılabilir bileşenler
│   │   ├── Auth/           # Kimlik doğrulama bileşenleri
│   │   ├── Layout/         # Layout bileşenleri
│   │   └── UI/             # UI bileşenleri
│   ├── pages/              # Sayfa bileşenleri
│   │   ├── Auth/           # Giriş/kayıt sayfaları
│   │   ├── Pets/           # Evcil hayvan sayfaları
│   │   ├── Adoption/       # Sahiplendirme sayfaları
│   │   ├── LostPets/       # Kayıp hayvan sayfaları
│   │   ├── Services/       # Hizmet sayfaları
│   │   ├── Community/      # Topluluk sayfaları
│   │   ├── Calendar/       # Takvim sayfaları
│   │   ├── Shop/           # Mağaza sayfaları
│   │   └── Badges/         # Rozet sayfaları
│   ├── services/           # API servisleri
│   │   ├── api/            # Firestore API'leri
│   │   ├── firebase.ts     # Firebase yapılandırması
│   │   └── i18n/           # Çoklu dil desteği
│   ├── store/              # Redux store
│   │   └── slices/         # Redux slice'ları
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Yardımcı fonksiyonlar
│   ├── types/              # TypeScript tip tanımları
│   ├── App.tsx             # Ana uygulama bileşeni
│   └── index.tsx           # Giriş noktası
├── package.json
├── tailwind.config.js
└── README.md
```

## 🔧 Yapılandırma

### Firebase Yapılandırması
```typescript
// src/services/firebase.ts
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Environment Variables
```bash
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_MAPBOX_TOKEN=your_mapbox_token
```

## 📱 Kullanım

### Kullanıcı Rolleri

1. **Normal Kullanıcı**
   - Evcil hayvan profili oluşturma
   - Sahiplendirme ilanı verme
   - Kayıp hayvan bildirimi
   - Forum ve PetStory paylaşımı

2. **Barınak/Dernek**
   - Toplu hayvan yönetimi
   - Özel sahiplendirme süreçleri
   - Bağış ve yardım talepleri

3. **Veteriner**
   - Hizmet listesi oluşturma
   - Randevu yönetimi
   - Sağlık kayıtları

4. **Admin**
   - Kullanıcı yönetimi
   - İçerik moderasyonu
   - Sistem ayarları

### Ana Özellikler

- **Dashboard**: Kişisel ana sayfa
- **Evcil Hayvan Yönetimi**: Profil oluşturma ve düzenleme
- **Sahiplendirme**: İlan verme ve başvuru yapma
- **Kayıp Hayvan**: Bildirim oluşturma ve arama
- **Veteriner Hizmetleri**: Hizmet arama ve randevu
- **Topluluk**: Forum ve sosyal paylaşım
- **Takvim**: Hatırlatıcılar ve etkinlikler
- **Mağaza**: Pet ürünleri alışverişi
- **Rozetler**: Başarı sistemi

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📞 İletişim

- **Proje Sahibi**: [Adınız]
- **Email**: [email@example.com]
- **GitHub**: [github.com/your-username]

## 🙏 Teşekkürler

- Firebase ekibine
- React ve Tailwind CSS topluluklarına
- Tüm katkıda bulunanlara

---

**PetaVerse** - Evcil hayvanlar için daha iyi bir dünya 🌍🐾