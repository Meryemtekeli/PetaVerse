# PetaVerse Geliştirme Rehberi

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Java 17+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+
- Redis 6+

### Kurulum

1. **Repository'yi klonlayın:**
```bash
git clone https://github.com/PetaVerse/PetaVerse.git
cd PetaVerse
```

2. **Docker ile başlatın:**
```bash
chmod +x start.sh
./start.sh
```

3. **Manuel kurulum (Docker olmadan):**

#### Backend Kurulumu
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

#### Frontend Kurulumu
```bash
cd frontend
npm install
npm start
```

## 📁 Proje Yapısı

```
PetaVerse/
├── backend/                 # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/petaverse/
│   │       ├── config/      # Konfigürasyonlar
│   │       ├── controller/  # REST Controller'lar
│   │       ├── entity/      # JPA Entity'ler
│   │       ├── repository/  # Repository'ler
│   │       ├── service/     # Business Logic
│   │       └── security/    # Güvenlik
│   └── src/main/resources/
│       └── application.yml  # Uygulama konfigürasyonu
├── frontend/               # React.js Frontend
│   ├── src/
│   │   ├── components/     # React bileşenleri
│   │   ├── pages/         # Sayfa bileşenleri
│   │   ├── services/      # API servisleri
│   │   ├── store/         # Redux store
│   │   └── utils/         # Yardımcı fonksiyonlar
│   └── public/            # Statik dosyalar
├── mobile/                # Flutter Mobile App
├── docs/                  # Dokümantasyon
└── docker/               # Docker konfigürasyonları
```

## 🔧 Geliştirme Ortamı

### Backend Geliştirme

1. **IDE Önerileri:**
   - IntelliJ IDEA (önerilen)
   - Eclipse
   - VS Code

2. **Veritabanı Kurulumu:**
```sql
CREATE DATABASE petaverse;
CREATE USER petaverse_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE petaverse TO petaverse_user;
```

3. **Uygulama Konfigürasyonu:**
   - `backend/src/main/resources/application.yml` dosyasını düzenleyin
   - Veritabanı bağlantı bilgilerini güncelleyin
   - JWT secret key'i değiştirin

4. **API Dokümantasyonu:**
   - Swagger UI: http://localhost:8080/swagger-ui.html
   - API Docs: http://localhost:8080/api-docs

### Frontend Geliştirme

1. **IDE Önerileri:**
   - VS Code (önerilen)
   - WebStorm
   - Atom

2. **Bağımlılık Yönetimi:**
```bash
npm install          # Bağımlılıkları yükle
npm run build        # Production build
npm run test         # Testleri çalıştır
npm run lint         # Linting
```

3. **State Yönetimi:**
   - Redux Toolkit kullanılıyor
   - Store: `src/store/`
   - Slices: `src/store/slices/`

## 🧪 Test

### Backend Testleri
```bash
cd backend
./mvnw test                    # Tüm testleri çalıştır
./mvnw test -Dtest=UserTest    # Belirli test sınıfı
```

### Frontend Testleri
```bash
cd frontend
npm test                       # Testleri çalıştır
npm run test:coverage          # Coverage raporu
```

## 📦 Deployment

### Production Build

1. **Backend:**
```bash
cd backend
./mvnw clean package -Pprod
```

2. **Frontend:**
```bash
cd frontend
npm run build
```

### Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 Güvenlik

### JWT Konfigürasyonu
- Güçlü secret key kullanın
- Token süresini uygun şekilde ayarlayın
- Refresh token implementasyonu

### Veritabanı Güvenliği
- Güçlü şifreler kullanın
- SSL bağlantısı
- Düzenli yedekleme

### API Güvenliği
- Rate limiting
- Input validation
- CORS konfigürasyonu

## 📝 Kod Standartları

### Java (Backend)
- Google Java Style Guide
- SonarQube kullanımı
- Unit test coverage > 80%

### TypeScript/JavaScript (Frontend)
- ESLint + Prettier
- TypeScript strict mode
- Component test coverage

### Git Workflow
- Feature branch workflow
- Conventional commits
- Pull request reviews

## 🐛 Debug

### Backend Debug
```bash
# Debug modunda çalıştır
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

### Frontend Debug
- Browser Developer Tools
- React Developer Tools
- Redux DevTools

## 📊 Monitoring

### Backend Monitoring
- Spring Boot Actuator
- Micrometer + Prometheus
- Log aggregation (ELK Stack)

### Frontend Monitoring
- Error tracking (Sentry)
- Performance monitoring
- User analytics

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Testleri çalıştırın
5. Pull request oluşturun

## 📞 Destek

- Issues: GitHub Issues
- Discussions: GitHub Discussions
- Email: support@petaverse.com

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. 