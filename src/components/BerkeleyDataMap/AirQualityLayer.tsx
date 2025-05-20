import React, { useContext } from 'react';
import { IconLayer } from '@deck.gl/layers';
import { ViewStateContext } from './MapContainer';

interface AirQualityLayerProps {
  data: any[];
  visible: boolean;
}

export function AirQualityLayer({ data, visible }: AirQualityLayerProps) {
  const viewState = useContext(ViewStateContext);
  if (!visible) return null;

  return (
    <IconLayer
      id="airquality-icon-layer"
      data={data}
      pickable
      iconAtlas="/icons/air.svg"
      iconMapping={{ marker: { x: 0, y: 0, width: 16, height: 16, mask: false } }}
      getIcon={() => 'marker'}
      sizeScale={1}
      getPosition={d => [d.lng, d.lat]}
      getSize={16}
      getColor={[0, 123, 255]}
      getTooltip={({ object }) => {
        if (!object) return null;
        let popupContent = `<div style=\"max-width: 200px;\">
          <h3>${object.title}</h3>
          <p>Location: ${object.lat?.toFixed(4)}, ${object.lng?.toFixed(4)}</p>`;
        if (object.details?.readings) {
          popupContent += `<div style=\"max-width:260px;\">
            <h3 style=\"margin-bottom:0.3em;\">${object.title}</h3>
            <div style=\"color:#666;font-size:0.95em;margin-bottom:0.5em;\">
              Provider: <strong>${object.provider || (object.details.provider ?? '')}</strong>
            </div>
            <table style=\"width:100%;font-size:0.97em;margin-bottom:0.5em;\">
              <thead>
                <tr><th align=\"left\">Parameter</th><th align=\"right\">Value</th><th align=\"left\">Unit</th></tr>
              </thead>
              <tbody>
                ${object.details.readings.map((r: any) => `
                  <tr>
                    <td>${r.parameter?.toUpperCase?.() || r.parameter}</td>
                    <td align=\"right\">${r.value}</td>
                    <td>${r.unit || ''}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            ${object.details.readings[0]?.datetimeUtc ? `<div style=\"font-size:0.9em;color:#888;\">Latest: ${new Date(object.details.readings[0].datetimeUtc).toLocaleString()}</div>` : ''}
          </div>`;
        }
        popupContent += `</div>`;
        return { html: popupContent };
      }}
    />
  );
};


