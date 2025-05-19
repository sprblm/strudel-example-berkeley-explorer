import React, { useEffect } from 'react';
import L from 'leaflet';

interface AirQualityLayerProps {
  map: L.Map;
  data: any[];
  visible: boolean;
}

const AirQualityLayer: React.FC<AirQualityLayerProps> = ({ map, data, visible }) => {
  useEffect(() => {
    if (!map || !visible) return;
    const markers: L.Layer[] = [];
    data.forEach(point => {
      const icon = L.icon({
        iconUrl: '/icons/air.svg',
        iconSize: [16, 16],
        iconAnchor: [8, 16],
        popupAnchor: [0, -16]
      });
      const marker = L.marker([point.lat, point.lng], { icon });
      let popupContent = `<div style=\"max-width: 200px;\">
        <h3>${point.title}</h3>
        <p>Location: ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}</p>`;
      if (point.details?.readings) {
        popupContent += `<div style=\"max-width:260px;\">
          <h3 style=\"margin-bottom:0.3em;\">${point.title}</h3>
          <div style=\"color:#666;font-size:0.95em;margin-bottom:0.5em;\">
            Provider: <strong>${point.provider || (point.details.provider ?? '')}</strong>
          </div>
          <table style=\"width:100%;font-size:0.97em;margin-bottom:0.5em;\">
            <thead>
              <tr><th align=\"left\">Parameter</th><th align=\"right\">Value</th><th align=\"left\">Unit</th></tr>
            </thead>
            <tbody>
              ${point.details.readings.map((r: any) => `
                <tr>
                  <td>${r.parameter?.toUpperCase?.() || r.parameter}</td>
                  <td align=\"right\">${r.value}</td>
                  <td>${r.unit || ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ${point.details.readings[0]?.datetimeUtc ? `<div style=\"font-size:0.9em;color:#888;\">Latest: ${new Date(point.details.readings[0].datetimeUtc).toLocaleString()}</div>` : ''}
        </div>`;
      }
      popupContent += `</div>`;
      marker.bindPopup(popupContent);
      marker.addTo(map);
      markers.push(marker);
    });
    return () => {
      markers.forEach(marker => marker.remove());
    };
  }, [map, data, visible]);
  return null;
};

export default AirQualityLayer;
