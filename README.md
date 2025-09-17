# PetaVerse - Evcil Hayvan Sahiplendirme ve Yönetim Platformu

## Proje Hakkında

PetaVerse, evcil hayvan sahiplerinin hayvanlarını sahiplendirme, çiftleştirme, sağlık takibi, kayıp hayvan bildirme, veteriner ve pet hizmetleri rehberi, sosyal paylaşım ve daha birçok ihtiyacını tek bir uygulama üzerinden karşılayabileceği kapsamlı bir platformdur.

## Özellikler

### 🏠 Kullanıcı Yönetimi
- Kolay kayıt ve giriş (e-posta, telefon, sosyal medya)
- Profil düzenleme ve şifre sıfırlama
- Çoklu kullanıcı rolleri (Normal Kullanıcı, Barınak/Dernek, Veteriner, Admin)

### 🐾 Evcil Hayvan Profili
- Detaylı hayvan bilgileri ve fotoğraf/video yönetimi
- Aşı ve tedavi takibi
- Anı sayfası (vefat eden hayvanlar için)

### 🏡 Sahiplendirme ve Çiftleştirme
- İlan oluşturma ve filtreleme
- Dijital sahiplendirme sözleşmesi
- AI destekli çiftleştirme önerileri
- Mesajlaşma ve moderasyon sistemi

### 🔍 Kayıp Hayvan Bildirimi
- Harita üzerinde kayıp hayvan gösterimi
- Otomatik bildirimler
- Bulunan hayvan bildirimi

### 🏥 Veteriner ve Pet Hizmet Rehberi
- Veteriner, petshop, kuaför listesi
- Kullanıcı yorumları ve puanlama
- Randevu talebi sistemi

### 📱 Sosyal Alanlar
- Forum ve bilgi paylaşımı
- PetStory (günlük paylaşım)
- Like, yorum ve takip sistemi

### ⏰ Hatırlatıcı ve Takvim
- Aşı, ilaç, veteriner randevusu hatırlatmaları
- Çiftleşme ve doğum takvimi

### 🛒 E-Ticaret
- Pet ürünleri satış ilanları
- Ödeme ve kargo entegrasyonu

### 🚨 Afet ve Acil Durum Modülü
- Afetlerde kayıp hayvan arama
- Gönüllü yardım ağı

## Teknoloji Stack

### Backend
- **Java 17** + **Spring Boot 3.x**
- **PostgreSQL** (Ana veritabanı)
- **Redis** (Önbellek ve oturum yönetimi)
- **JWT** (Kimlik doğrulama)
- **Spring Security** (Güvenlik)

### Frontend (Web)
- **React.js 18** + **TypeScript**
- **Tailwind CSS** (Stil)
- **Redux Toolkit** (State yönetimi)
- **React Router** (Routing)

### Mobil
- **Flutter 3.x** + **Dart**
- **GetX** (State yönetimi)

### Diğer Servisler
- **Firebase** (Bildirimler ve mesajlaşma)
- **Google Maps API** (Harita servisleri)
- **AWS S3** (Dosya depolama)

## Proje Yapısı

```
PetaVerse/
├── backend/                 # Spring Boot Backend
├── frontend/               # React.js Web Frontend
├── mobile/                 # Flutter Mobile App
├── docs/                   # Dokümantasyon
└── docker/                 # Docker konfigürasyonları
```

## Kurulum

### Gereksinimler
- Java 17+
- Node.js 18+
- Flutter 3.x
- PostgreSQL 14+
- Redis 6+

### Backend Kurulumu
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

### Frontend Kurulumu
```bash
cd frontend
npm install
npm start
```

### Mobil Kurulumu
```bash
cd mobile
flutter pub get
flutter run
```

## Geliştirme Süreci

Bu proje çevik metodoloji ile geliştirilmektedir:
- Sprint bazlı modüler geliştirme
- Erken ve sık teslimatlar
- Test odaklı geliştirme
- Kullanıcı geri bildirimine dayalı iyileştirmeler

## Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## İletişim

Proje Lideri/Tasarımcısı - (@MeryemTekeli)

Proje Linki: https://github.com/Meryemtekeli/PetaVerse
