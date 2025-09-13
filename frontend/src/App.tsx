import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './services/i18n'; // i18n sistemini import et

// Layout
import Navbar from './components/Layout/Navbar';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import MapPage from './pages/MapPage';
import { ChatPage } from './components/Chat/ChatPage';
import { AnalyticsDashboard } from './pages/Analytics/AnalyticsDashboard';
import { AIDashboard } from './pages/AI/AIDashboard';
import AdminPanel from './pages/AdminPanel';

// Pet Pages
import PetProfilePage from './pages/Pets/PetProfilePage';
import PetEditPage from './pages/Pets/PetEditPage';

// Adoption Pages
import AdoptionListingsPage from './pages/Adoption/AdoptionListingsPage';
import AdoptionDetailPage from './pages/Adoption/AdoptionDetailPage';
import AdoptionCreatePage from './pages/Adoption/AdoptionCreatePage';

// Lost Pets Pages
import LostPetsPage from './pages/LostPets/LostPetsPage';
import LostPetCreatePage from './pages/LostPets/LostPetCreatePage';

// Services Pages
import VeterinariansPage from './pages/Services/VeterinariansPage';

// Community Pages
import CommunityPage from './pages/Community/CommunityPage';

// Calendar Pages
import CalendarPage from './pages/Calendar/CalendarPage';

// Shop Pages
import ShopPage from './pages/Shop/ShopPage';

// Badges Pages
import BadgeDashboard from './pages/Badges/BadgeDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
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
            <Route path="/map" element={<MapPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/shop" element={<ShopPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/pets/:id" element={
              <ProtectedRoute>
                <PetProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/pets/:id/edit" element={
              <ProtectedRoute>
                <PetEditPage />
              </ProtectedRoute>
            } />
            <Route path="/adoption/create" element={
              <ProtectedRoute>
                <AdoptionCreatePage />
              </ProtectedRoute>
            } />
            <Route path="/lost-pets/create" element={
              <ProtectedRoute>
                <LostPetCreatePage />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            } />
            <Route path="/badges" element={
              <ProtectedRoute>
                <BadgeDashboard />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AnalyticsDashboard />
              </ProtectedRoute>
            } />
            <Route path="/ai" element={
              <ProtectedRoute>
                <AIDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPanel />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App; 