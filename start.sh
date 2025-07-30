#!/bin/bash

echo "🐾 PetaVerse - Evcil Hayvan Sahiplendirme Platformu"
echo "=================================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker bulunamadı. Lütfen Docker'ı yükleyin."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose bulunamadı. Lütfen Docker Compose'u yükleyin."
    exit 1
fi

echo "🚀 Servisleri başlatılıyor..."

# Start services with Docker Compose
docker-compose up -d

echo "⏳ Servisler başlatılıyor, lütfen bekleyin..."

# Wait for services to be ready
sleep 30

echo "✅ Servisler başlatıldı!"
echo ""
echo "🌐 Uygulamalar:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8080"
echo "   - Swagger UI: http://localhost:8080/swagger-ui.html"
echo ""
echo "🗄️  Veritabanları:"
echo "   - PostgreSQL: localhost:5432"
echo "   - Redis: localhost:6379"
echo ""
echo "📝 Logları görüntülemek için: docker-compose logs -f"
echo "🛑 Durdurmak için: docker-compose down" 