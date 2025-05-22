import React, { useState, createContext, useMemo, useCallback, useRef } from 'react';
import DeckGL from '@deck.gl/react/typed';
import type { Layer, LayerContext } from '@deck.gl/core/typed';
import { StaticMap } from 'react-map-gl';
import { MapView, WebMercatorViewport } from '@deck.gl/core/typed';

// Context for viewState
export const ViewStateContext = createContext<any>(null);

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_PUBLIC_MAPBOX_TOKEN;

interface MapContainerProps {
  children?: React.ReactNode;
  height?: number | string;
  width?: number | string;
  layers?: Layer[];
  onClick?: (info: any) => void;
  onViewStateChange?: (viewState: any) => void;
}

/**
 * MapContainer now provides a deck.gl + Mapbox map context for children.
 */

const INITIAL_VIEW_STATE = {
  longitude: -122.25948,
  latitude: 37.872,
  zoom: 12,
  pitch: 0,
  bearing: 0,
  minZoom: 10,
  maxZoom: 20
};

const MapContainer: React.FC<MapContainerProps> = ({ 
  children, 
  height = 400, 
  width = '100%', 
  layers = [],
  onClick,
  onViewStateChange
}) => {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const deckRef = useRef<any>(null);

  // Optionally: provide viewState/setViewState via context for children
  // For now, just pass as props

  // Ensure height and width are strings with units for CSS
  const heightStr = typeof height === 'number' ? `${height}px` : height;
  const widthStr = typeof width === 'number' ? `${width}px` : width;

  // Initialize map view
  const view = useMemo(() => new MapView({ 
    id: 'map-view',
    controller: true
  }), []);

  // Handle view state changes
  const handleViewStateChange = useCallback(({ viewState: newViewState }: { viewState: any }) => {
    setViewState(prevState => ({
      ...prevState,
      ...newViewState
    }));
    
    if (onViewStateChange) {
      onViewStateChange(newViewState);
    }
  }, [onViewStateChange]);

  return (
    <ViewStateContext.Provider value={viewState}>
      <div style={{ position: 'relative', height: heightStr, width: widthStr }}>
        <DeckGL
          ref={deckRef}
          viewState={viewState}
          onViewStateChange={handleViewStateChange}
          layers={layers}
          onClick={onClick}
          views={view}
          controller={{
            doubleClickZoom: true,
            touchZoom: true,
            touchRotate: true,
            keyboard: true,
            scrollZoom: true,
            dragPan: true,
            dragRotate: true
          }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          getCursor={({ isDragging, isHovering }) => 
            isDragging ? 'grabbing' : isHovering ? 'pointer' : 'grab'
          }
        >
          {children}
          <StaticMap
            mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
            mapStyle="mapbox://styles/mapbox/light-v11"
            reuseMaps
            preventStyleDiffing={true}
            style={{ position: 'absolute' }}
          />
        </DeckGL>
      </div>
    </ViewStateContext.Provider>
  );
};

export default MapContainer;
