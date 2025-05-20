import React, { useContext } from 'react';
import { IconLayer } from '@deck.gl/layers';
import { ViewStateContext } from './MapContainer';

interface TreeLayerProps {
  data: any[];
  visible: boolean;
}

export function TreeLayer({ data, visible }: TreeLayerProps) {
  const viewState = useContext(ViewStateContext);
  if (!visible) return null;

  return (
    <IconLayer
      id="tree-icon-layer"
      data={data}
      pickable
      iconAtlas="/icons/tree.svg"
      iconMapping={{ marker: { x: 0, y: 0, width: 22, height: 22, mask: false } }}
      getIcon={() => 'marker'}
      sizeScale={1}
      getPosition={d => [d.lng, d.lat]}
      getSize={22}
      getColor={[34, 139, 34]}
      getTooltip={({ object }) =>
        object
          ? {
              html: `<div style="max-width: 200px;">
                <h3>${object.title}</h3>
                <p>Condition: ${object.category || 'Unknown'}</p>
                <p>Location: ${object.lat?.toFixed(4)}, ${object.lng?.toFixed(4)}</p>
                ${object.details?.DBHMAX ? `<p>DBH: ${object.details.DBHMAX} in</p>` : ''}
                ${object.details?.HEIGHT ? `<p>Height: ${object.details.HEIGHT} feet</p>` : ''}
                ${object.details?.OBSERVATIONDATE ? `<p>Observed: ${object.details.OBSERVATIONDATE}</p>` : ''}
              </div>`
            }
          : null
      }
    />
  );
};


