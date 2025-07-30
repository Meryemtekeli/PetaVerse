import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import PetProfilePage from './pages/Pets/PetProfilePage';
import AdoptionListingsPage from './pages/Adoption/AdoptionListingsPage';
import AdoptionDetailPage from './pages/Adoption/AdoptionDetailPage';
import CreateAdoptionPage from './pages/Adoption/CreateAdoptionPage';
import LostPetsPage from './pages/LostPets/LostPetsPage';
import VeterinariansPage from './pages/Services/VeterinariansPage';
import CommunityPage from './pages/Community/CommunityPage';
import ProfilePage from './pages/Profile/ProfilePage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="App">
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/adoption" element={<AdoptionListingsPage />} />
                <Route path="/adoption/:id" element={<AdoptionDetailPage />} />
                <Route path="/lost-pets" element={<LostPetsPage />} />
                <Route path="/veterinarians" element={<VeterinariansPage />} />
                <Route path="/community" element={<CommunityPage />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/pets/:id" element={
                  <ProtectedRoute>
                    <PetProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/adoption/create" element={
                  <ProtectedRoute>
                    <CreateAdoptionPage />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
              </Routes>
            </Layout>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App; 