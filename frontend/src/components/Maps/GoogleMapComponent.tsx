import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  description?: string;
  type: 'adoption' | 'lost' | 'vet' | 'petshop';
  data?: any;
}

interface GoogleMapComponentProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  onMapClick?: (position: { lat: number; lng: number }) => void;
  height?: string;
  showControls?: boolean;
}

export const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  center = { lat: 39.925533, lng: 32.866287 }, // Ankara coordinates
  zoom = 10,
  markers = [],
  onMarkerClick,
  onMapClick,
  height = '500px',
  showControls = true
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapMarkers, setMapMarkers] = useState<google.maps.Marker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Marker icons for different types
  const getMarkerIcon = (type: string) => {
    const icons = {
      adoption: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="#10B981" stroke="#fff" stroke-width="2"/>
            <path d="M12 16l3 3 6-6" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 16)
      },
      lost: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="#EF4444" stroke="#fff" stroke-width="2"/>
            <path d="M16 8v8l4 4" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 16)
      },
      vet: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="#3B82F6" stroke="#fff" stroke-width="2"/>
            <path d="M16 8v8l4 4" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 16)
      },
      petshop: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="#F59E0B" stroke="#fff" stroke-width="2"/>
            <path d="M12 16l3 3 6-6" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 16)
      }
    };
    return icons[type as keyof typeof icons] || icons.adoption;
  };

  useEffect(() => {
    const initMap = async () => {
      try {
        setLoading(true);
        setError(null);

        const loader = new Loader({
          apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY',
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        const google = await loader.load();

        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center,
            zoom,
            mapTypeControl: showControls,
            streetViewControl: showControls,
            fullscreenControl: showControls,
            zoomControl: showControls,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          });

          setMap(mapInstance);

          // Add click listener
          if (onMapClick) {
            mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
              if (event.latLng) {
                onMapClick({
                  lat: event.latLng.lat(),
                  lng: event.latLng.lng()
                });
              }
            });
          }
        }
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Harita yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    initMap();
  }, []);

  // Update markers when markers prop changes
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    mapMarkers.forEach(marker => marker.setMap(null));
    setMapMarkers([]);

    // Add new markers
    const newMarkers: google.maps.Marker[] = [];
    
    markers.forEach(markerData => {
      const marker = new google.maps.Marker({
        position: markerData.position,
        map,
        title: markerData.title,
        icon: getMarkerIcon(markerData.type),
        animation: google.maps.Animation.DROP
      });

      // Add click listener
      marker.addListener('click', () => {
        if (onMarkerClick) {
          onMarkerClick(markerData);
        }
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold text-gray-900">${markerData.title}</h3>
            ${markerData.description ? `<p class="text-sm text-gray-600 mt-1">${markerData.description}</p>` : ''}
            <div class="mt-2">
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                markerData.type === 'adoption' ? 'bg-green-100 text-green-800' :
                markerData.type === 'lost' ? 'bg-red-100 text-red-800' :
                markerData.type === 'vet' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }">
                ${markerData.type === 'adoption' ? 'Sahiplendirme' :
                  markerData.type === 'lost' ? 'Kayıp Hayvan' :
                  markerData.type === 'vet' ? 'Veteriner' :
                  'Pet Shop'}
              </span>
            </div>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      newMarkers.push(marker);
    });

    setMapMarkers(newMarkers);

    // Fit bounds if markers exist
    if (markers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markers.forEach(marker => {
        bounds.extend(marker.position);
      });
      map.fitBounds(bounds);
    }
  }, [map, markers, onMarkerClick]);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Harita yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-2">🗺️</div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={mapRef} style={{ height, width: '100%' }} />
      
      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 text-sm">
        <h4 className="font-semibold text-gray-900 mb-2">Açıklama</h4>
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span>Sahiplendirme</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span>Kayıp Hayvan</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span>Veteriner</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span>Pet Shop</span>
          </div>
        </div>
      </div>
    </div>
  );
};
