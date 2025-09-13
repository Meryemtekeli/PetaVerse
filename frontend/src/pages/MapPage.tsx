import React, { useState, useEffect } from "react";
import { GoogleMapComponent } from "../components/Maps/GoogleMapComponent";
import { MapMarker } from "../components/Maps/GoogleMapComponent";
import { mapApi } from "../services/api/mapApi";

const MapPage: React.FC = () => {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    try {
      setLoading(true);
      
      // Try to load from API first, fallback to mock data
      try {
        const apiMarkers = await mapApi.getAllMarkers();
        const convertedMarkers: MapMarker[] = apiMarkers.map(marker => ({
          id: marker.id,
          position: { lat: marker.latitude, lng: marker.longitude },
          title: marker.title,
          description: marker.description,
          type: marker.type,
          data: marker.data
        }));
        setMarkers(convertedMarkers);
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError);
        
        // Fallback to mock data
        const mockMarkers: MapMarker[] = [
          {
            id: '1',
            position: { lat: 39.925533, lng: 32.866287 },
            title: 'Golden Retriever Sahiplendirme',
            description: '3 aylık, çok enerjik ve oyuncu bir Golden Retriever yavrusu.',
            type: 'adoption',
            data: { id: 1, fee: 0 }
          },
          {
            id: '2',
            position: { lat: 39.920533, lng: 32.870287 },
            title: 'Kayıp Kedi - Pamuk',
            description: 'Beyaz renkli, 2 yaşında, çok sakin bir kedi.',
            type: 'lost',
            data: { id: 2, lastSeen: '2024-01-15' }
          },
          {
            id: '3',
            position: { lat: 39.930533, lng: 32.860287 },
            title: 'Veteriner Hekim Dr. Ahmet Yılmaz',
            description: '24 saat acil veteriner hizmeti.',
            type: 'vet',
            data: { id: 3, phone: '+90 555 123 4567' }
          },
          {
            id: '4',
            position: { lat: 39.915533, lng: 32.875287 },
            title: 'Pet Shop Ankara',
            description: 'Köpek ve kedi mamaları, oyuncaklar ve aksesuarlar.',
            type: 'petshop',
            data: { id: 4, rating: 4.5 }
          }
        ];
        setMarkers(mockMarkers);
      }
    } catch (error) {
      console.error('Failed to load map data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMarkers = selectedType === 'all' 
    ? markers 
    : markers.filter(marker => marker.type === selectedType);

  const handleMarkerClick = (marker: MapMarker) => {
    console.log('Marker clicked:', marker);
    // Handle marker click - could open modal, navigate to detail page, etc.
  };

  const handleMapClick = (position: { lat: number; lng: number }) => {
    console.log('Map clicked at:', position);
    // Handle map click - could add new marker, show location info, etc.
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Harita</h1>
          <p className="mt-2 text-gray-600">
            Sahiplendirme ilanları, kayıp hayvanlar, veterinerler ve pet shop'ları haritada görün
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setSelectedType('adoption')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === 'adoption'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Sahiplendirme
            </button>
            <button
              onClick={() => setSelectedType('lost')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === 'lost'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Kayıp Hayvanlar
            </button>
            <button
              onClick={() => setSelectedType('vet')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === 'vet'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Veterinerler
            </button>
            <button
              onClick={() => setSelectedType('petshop')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === 'petshop'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pet Shop'lar
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <GoogleMapComponent
            center={{ lat: 39.925533, lng: 32.866287 }}
            zoom={10}
            markers={filteredMarkers}
            onMarkerClick={handleMarkerClick}
            onMapClick={handleMapClick}
            height="600px"
            showControls={true}
          />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-green-600 text-sm">🏠</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sahiplendirme</p>
                <p className="text-lg font-semibold text-gray-900">
                  {markers.filter(m => m.type === 'adoption').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-red-600 text-sm">🔍</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Kayıp Hayvan</p>
                <p className="text-lg font-semibold text-gray-900">
                  {markers.filter(m => m.type === 'lost').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 text-sm">🏥</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Veteriner</p>
                <p className="text-lg font-semibold text-gray-900">
                  {markers.filter(m => m.type === 'vet').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-yellow-600 text-sm">🛒</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pet Shop</p>
                <p className="text-lg font-semibold text-gray-900">
                  {markers.filter(m => m.type === 'petshop').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;