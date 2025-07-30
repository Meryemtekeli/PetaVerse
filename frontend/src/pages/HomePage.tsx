import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  HomeIcon, 
  MapPinIcon, 
  PhoneIcon, 
  UserGroupIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Evcil Hayvanlar İçin
              <span className="text-primary-600 block">Güvenli Yuva</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              PetaVerse ile evcil hayvanlarınızı güvenle sahiplendirin, 
              yeni aile üyelerinizi bulun ve hayvan dostlarımız için daha iyi bir dünya yaratın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-4"
              >
                Hemen Başla
              </Link>
              <Link
                to="/adoption"
                className="btn-outline text-lg px-8 py-4"
              >
                Sahiplendir
              </Link>
            </div>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20"></div>
          <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-10"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neden PetaVerse?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Evcil hayvan sahiplendirme sürecini güvenli, kolay ve şeffaf hale getiriyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Güvenli Sahiplendirme</h3>
              <p className="text-gray-600">
                Tüm kullanıcılarımız doğrulanır ve sahiplendirme süreci güvenle takip edilir.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPinIcon className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Konum Bazlı Arama</h3>
              <p className="text-gray-600">
                Yakınınızdaki evcil hayvanları bulun ve kolayca iletişime geçin.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sağlık Takibi</h3>
              <p className="text-gray-600">
                Evcil hayvanlarınızın aşı ve sağlık bilgilerini kolayca yönetin.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="w-8 h-8 text-warning-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Topluluk Desteği</h3>
              <p className="text-gray-600">
                Deneyimli hayvan severlerle bağlantı kurun ve tavsiye alın.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hizmetlerimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Evcil hayvanlarınız için ihtiyacınız olan her şey tek platformda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <HomeIcon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sahiplendirme</h3>
              <p className="text-gray-600 mb-4">
                Evcil hayvanlarınızı güvenle sahiplendirin veya yeni bir aile üyesi bulun.
              </p>
              <Link to="/adoption" className="text-primary-600 hover:text-primary-700 font-medium">
                İlanları Görüntüle →
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                <PhoneIcon className="w-6 h-6 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Veteriner Hizmetleri</h3>
              <p className="text-gray-600 mb-4">
                Yakınınızdaki veterinerler, petshop'lar ve pet hizmetlerini keşfedin.
              </p>
              <Link to="/veterinarians" className="text-secondary-600 hover:text-secondary-700 font-medium">
                Hizmetleri Keşfet →
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Topluluk</h3>
              <p className="text-gray-600 mb-4">
                Diğer hayvan severlerle bağlantı kurun, deneyimlerinizi paylaşın.
              </p>
              <Link to="/community" className="text-success-600 hover:text-success-700 font-medium">
                Topluluğa Katıl →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              PetaVerse İstatistikleri
            </h2>
            <p className="text-xl text-primary-100">
              Binlerce evcil hayvan mutlu yuvalar buldu.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">1,234</div>
              <div className="text-primary-100">Başarılı Sahiplendirme</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">5,678</div>
              <div className="text-primary-100">Kayıtlı Kullanıcı</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">89</div>
              <div className="text-primary-100">Veteriner Kliniği</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">156</div>
              <div className="text-primary-100">Pet Hizmeti</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Hemen Katılın ve Fark Yaratın
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Evcil hayvanlar için daha iyi bir dünya yaratmaya yardım edin. 
            PetaVerse ailesine katılın ve hayvan dostlarımızın mutlu yuvalar bulmasına yardım edin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn-primary text-lg px-8 py-4"
            >
              Ücretsiz Kayıt Ol
            </Link>
            <Link
              to="/about"
              className="btn-outline text-lg px-8 py-4"
            >
              Daha Fazla Bilgi
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">PetaVerse</h3>
              <p className="text-gray-400">
                Evcil hayvanlar için güvenli sahiplendirme platformu.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hizmetler</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/adoption" className="hover:text-white">Sahiplendirme</Link></li>
                <li><Link to="/veterinarians" className="hover:text-white">Veteriner Hizmetleri</Link></li>
                <li><Link to="/community" className="hover:text-white">Topluluk</Link></li>
                <li><Link to="/lost-pets" className="hover:text-white">Kayıp Hayvanlar</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Şirket</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">Hakkımızda</Link></li>
                <li><Link to="/contact" className="hover:text-white">İletişim</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Gizlilik</Link></li>
                <li><Link to="/terms" className="hover:text-white">Kullanım Şartları</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">İletişim</h4>
              <ul className="space-y-2 text-gray-400">
                <li>info@petaverse.com</li>
                <li>+90 (212) 555 0123</li>
                <li>İstanbul, Türkiye</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PetaVerse. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 