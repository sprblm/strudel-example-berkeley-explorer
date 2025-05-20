import React, { useState, createContext } from 'react';
import DeckGL from '@deck.gl/react';
import { StaticMap } from 'react-map-gl';

// Context for viewState
export const ViewStateContext = createContext<any>(null);

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_PUBLIC_MAPBOX_TOKEN;

interface MapContainerProps {
  children?: React.ReactNode;
  height?: number | string;
  width?: number | string;
  layers?: any[];
}

/**
 * MapContainer now provides a deck.gl + Mapbox map context for children.
 */

const INITIAL_VIEW_STATE = {
  longitude: -122.2680,
  latitude: 37.8715,
  zoom: 15,
  pitch: 0,
  bearing: 0,
};

const MapContainer: React.FC<MapContainerProps> = ({ children, height = 400, width = '100%' }) => {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  // Optionally: provide viewState/setViewState via context for children
  // For now, just pass as props

  // Ensure height and width are strings for DeckGL/StaticMap
  const heightStr = typeof height === 'number' ? `${height}px` : height;
  const widthStr = typeof width === 'number' ? `${width}px` : width;

  return (
    <ViewStateContext.Provider value={viewState}>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        viewState={viewState}
        controller={true}
        onViewStateChange={(params: any) => setViewState(params.viewState)}
        style={{ height: heightStr, width: widthStr }}
      >
        <StaticMap
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/mapbox/light-v11"
          reuseMaps
          preventStyleDiffing={true}
          height={heightStr}
          width={widthStr}
        />
        {/* Render overlays/layers as children */}
        {children}
      </DeckGL>
    </ViewStateContext.Provider>
  );
};

export default MapContainer;
