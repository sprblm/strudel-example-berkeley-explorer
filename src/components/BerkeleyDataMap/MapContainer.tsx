import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapContainerProps {
  children?: React.ReactNode;
  height?: number | string;
  width?: number | string;
  onMapReady?: (map: L.Map) => void;
}

/**
 * MapContainer handles Leaflet map initialization and provides the map instance to children via onMapReady.
 */

const MapContainer: React.FC<MapContainerProps> = ({ children, height = 400, width = '100%', onMapReady }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    // Optionally handle mapContainerRef.current size if needed
    mapRef.current = L.map(mapContainerRef.current).setView([37.8715, -122.2680], 15);
    // Add base tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);
    // Expose map instance to parent/children
    if (onMapReady && mapRef.current) {
      onMapReady(mapRef.current);
    }
  }, [onMapReady]);

  return (
    <div style={{ height, width, position: 'relative' }}>
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} id="berkeley-map-container" />
      {/* Render overlays/layers as children */}
      {children}
    </div>
  );
};

export default MapContainer;
