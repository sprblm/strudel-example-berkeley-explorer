import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';

// This component is lazily loaded to avoid SSR issues with Leaflet
const LeafletComponents = (props: any) => {
  const { children, center, zoom, style } = props;
  
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={style}
    >
      {children}
    </MapContainer>
  );
};

// Attach Leaflet components to our main component
LeafletComponents.TileLayer = TileLayer;
LeafletComponents.Marker = Marker;
LeafletComponents.Popup = Popup;
LeafletComponents.CircleMarker = CircleMarker;

export default LeafletComponents;
