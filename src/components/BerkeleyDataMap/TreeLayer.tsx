import React, { useEffect } from 'react';
import L from 'leaflet';

interface TreeLayerProps {
  map: L.Map;
  data: any[];
  visible: boolean;
}

const TreeLayer: React.FC<TreeLayerProps> = ({ map, data, visible }) => {
  useEffect(() => {
    if (!map || !visible) return;
    const markers: L.Layer[] = [];
    data.forEach(point => {
      const icon = L.icon({
        iconUrl: '/icons/tree.svg',
        iconSize: [22, 22],
        iconAnchor: [11, 22],
        popupAnchor: [0, -22]
      });
      const marker = L.marker([point.lat, point.lng], { icon });
      marker.bindPopup(
        `<div style="max-width: 200px;">
          <h3>${point.title}</h3>
          <p>Condition: ${point.category || 'Unknown'}</p>
          <p>Location: ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}</p>
          ${point.details?.DBHMAX ? `<p>DBH: ${point.details.DBHMAX} in</p>` : ''}
          ${point.details?.HEIGHT ? `<p>Height: ${point.details.HEIGHT} feet</p>` : ''}
          ${point.details?.OBSERVATIONDATE ? `<p>Observed: ${point.details.OBSERVATIONDATE}</p>` : ''}
        </div>`
      );
      marker.addTo(map);
      markers.push(marker);
    });
    return () => {
      markers.forEach(marker => marker.remove());
    };
  }, [map, data, visible]);
  return null;
};

export default TreeLayer;
