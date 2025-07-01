import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

interface MapViewProps {
  results: SearchResult[];
  selectedStation: TrainStation | null;
  selectedResult: SearchResult | null;
  onResultClick: (result: SearchResult) => void;
}

// Component to handle map center updates
const MapController: React.FC<{ center: [number, number], zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
};

export const MapView: React.FC<MapViewProps> = ({
  results,
  selectedStation,
  selectedResult,
  onResultClick
}) => {
  const mapRef = useRef<L.Map>(null);

  // Default to center of Netherlands
  const defaultCenter: [number, number] = [52.3676, 4.9041];
  const defaultZoom = 7;

  // Calculate map center and zoom based on results and selected station
  const getMapCenterAndZoom = (): { center: [number, number], zoom: number } => {
    if (selectedResult) {
      return {
        center: [selectedResult.lat, selectedResult.lng],
        zoom: 15
      };
    }
    
    if (selectedStation) {
      return {
        center: [selectedStation.lat, selectedStation.lng],
        zoom: results.length > 0 ? 13 : 11
      };
    }
    
    return {
      center: defaultCenter,
      zoom: defaultZoom
    };
  };

  const { center, zoom } = getMapCenterAndZoom();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-96">
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController center={center} zoom={zoom} />
        
        {/* Train Station Marker */}
        {selectedStation && (
          <Marker 
            position={[selectedStation.lat, selectedStation.lng]} 
            icon={stationIcon}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-ns-blue">{selectedStation.name}</h3>
                <p className="text-sm text-gray-600">{selectedStation.city}</p>
                <p className="text-xs text-gray-500">Train Station</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Result Markers */}
        {results.map((result) => (
          <Marker
            key={result.id}
            position={[result.lat, result.lng]}
            icon={resultIcon}
            eventHandlers={{
              click: () => onResultClick(result)
            }}
          >
            <Popup>
              <div className="min-w-48">
                <h3 className="font-semibold text-gray-900 mb-1">{result.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{result.type}</p>
                <p className="text-xs text-gray-500 mb-2">{result.address}</p>
                
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Distance:</span>
                    <span className="font-medium">{result.distance} km</span>
                  </div>
                  
                  {result.rating && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rating:</span>
                      <span className="font-medium">⭐ {result.rating}</span>
                    </div>
                  )}
                  
                  {result.openingHours && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Hours:</span>
                      <span className="font-medium text-green-600">{result.openingHours}</span>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};