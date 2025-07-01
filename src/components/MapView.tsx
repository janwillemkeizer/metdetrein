import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { SearchResult, TrainStation } from '../types';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const stationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const resultIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapViewProps {
  center: [number, number];
  zoom: number;
  results: SearchResult[];
  selectedResult?: SearchResult | null;
  stations?: TrainStation[];
  searchRadius?: number; // in kilometers
}

// Component to update map view when center changes
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
}

export const MapView: React.FC<MapViewProps> = ({ 
  center, 
  zoom, 
  results, 
  selectedResult, 
  stations = [],
  searchRadius = 2
}) => {
  const mapRef = useRef<L.Map | null>(null);

  // Convert km to meters for circle display
  const radiusMeters = searchRadius * 1000;

  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full rounded-lg"
        ref={mapRef}
      >
        <ChangeView center={center} zoom={zoom} />
        
        {/* Base map tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Search radius circles for each station */}
        {stations.map((station) => (
          <Circle
            key={`circle-${station.id}`}
            center={[station.lat, station.lng]}
            radius={radiusMeters}
            pathOptions={{
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.05,
              weight: 1,
              dashArray: '5, 5'
            }}
          />
        ))}

        {/* Train station markers */}
        {stations.map((station) => (
          <Marker 
            key={`station-${station.id}`}
            position={[station.lat, station.lng]} 
            icon={stationIcon}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-lg text-blue-600">
                  🚂 {station.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{station.city}</p>
                <p className="text-xs text-gray-500">
                  Station Code: {station.code}
                </p>
                <p className="text-xs text-gray-500">
                  Type: {station.type?.charAt(0).toUpperCase() + station.type?.slice(1)}
                </p>
                <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                  {results.filter(r => r.trainStation.id === station.id).length} venues found within {searchRadius}km
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Result markers */}
        {results.map((result) => {
          const isSelected = selectedResult?.id === result.id;
          const icon = isSelected ? selectedIcon : resultIcon;
          
          return (
            <Marker
              key={result.id}
              position={[result.lat, result.lng]}
              icon={icon}
            >
              <Popup>
                <div className="max-w-xs">
                  <h3 className="font-semibold text-lg mb-2">
                    {result.name}
                  </h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="capitalize font-medium text-blue-600">
                        {result.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Distance:</span>
                      <span className="font-medium">
                        {result.distance.toFixed(1)} km from station
                      </span>
                    </div>
                    
                    <div className="bg-blue-50 p-2 rounded">
                      <div className="text-xs text-gray-600">Nearest Station:</div>
                      <div className="font-medium text-blue-700">
                        🚂 {result.trainStation.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {result.trainStation.city}
                      </div>
                    </div>
                    
                    {result.address && (
                      <div className="border-t pt-2">
                        <span className="text-gray-600 text-xs">Address:</span>
                        <p className="text-xs mt-1">{result.address}</p>
                      </div>
                    )}
                    
                    {result.rating && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Rating:</span>
                        <span className="font-medium">
                          ⭐ {result.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                    
                    {result.openingHours && (
                      <div className="border-t pt-2">
                        <span className="text-gray-600 text-xs">Hours:</span>
                        <p className="text-xs mt-1 font-mono">
                          {result.openingHours}
                        </p>
                      </div>
                    )}
                    
                    {(result.phone || result.website) && (
                      <div className="border-t pt-2 space-y-1">
                        {result.phone && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-600">📞</span>
                            <a 
                              href={`tel:${result.phone}`}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              {result.phone}
                            </a>
                          </div>
                        )}
                        {result.website && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-600">🌐</span>
                            <a 
                              href={result.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Website
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="border-t pt-2 text-xs text-gray-500">
                      <p>Data from OpenStreetMap</p>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};