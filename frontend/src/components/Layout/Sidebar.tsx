import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  HomeIcon,
  HeartIcon,
  UserGroupIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  CogIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { RootState } from '../../store';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const navigation = [
    { name: 'Ana Sayfa', href: '/', icon: HomeIcon },
    { name: 'Sahiplendirme', href: '/adoption', icon: HeartIcon },
    { name: 'Kayıp Hayvanlar', href: '/lost-pets', icon: ExclamationTriangleIcon },
    { name: 'Veterinerler', href: '/veterinarians', icon: PhoneIcon },
    { name: 'Topluluk', href: '/community', icon: UserGroupIcon },
  ];

  const authenticatedNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
    { name: 'Evcil Hayvanlarım', href: '/my-pets', icon: HeartIcon },
    { name: 'İlanlarım', href: '/my-listings', icon: CalendarIcon },
    { name: 'Ayarlar', href: '/settings', icon: CogIcon },
  ];

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-xl font-semibold text-gray-900">Menü</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {/* Public Navigation */}
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${
                        isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}

              {/* Authenticated Navigation */}
              {isAuthenticated && (
                <>
                  <div className="pt-6 pb-2">
                    <div className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Hesabım
                    </div>
                  </div>
                  {authenticatedNavigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-primary-100 text-primary-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon
                          className={`mr-3 flex-shrink-0 h-6 w-6 ${
                            isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </>
              )}
            </nav>
          </div>

          {/* User Info */}
          {isAuthenticated && user && (
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div>
                  {user.profileImageUrl ? (
                    <img
                      className="inline-block h-9 w-9 rounded-full"
                      src={user.profileImageUrl}
                      alt={user.username}
                    />
                  ) : (
                    <div className="inline-block h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600">
                        {user.firstName?.charAt(0) || user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {user.firstName || user.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 