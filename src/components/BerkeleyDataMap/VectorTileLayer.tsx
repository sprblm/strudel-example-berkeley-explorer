import { MVTLayer } from '@deck.gl/geo-layers';

export function createVectorTileLayer(options: {
  id: string;
  sourceUrl: string;
  visible?: boolean;
  minZoom?: number;
  maxZoom?: number;
  onClick?: (info: any) => void;
  onHover?: (info: any) => void;
  getFillColor?: any;
  getLineColor?: any;
  getLineWidth?: any;
  getPointRadius?: number;
  source?: string;
  sourceLayer?: string;
  paint?: {
    [key: string]: any;
  };
  layout?: {
    [key: string]: any;
  };
}) {
  // Ensure the MVTLayer is properly configured
  return new MVTLayer({
    id: options.id,
    data: options.sourceUrl,
    minZoom: options.minZoom ?? 0,
    maxZoom: options.maxZoom ?? 16,
    visible: options.visible ?? true,
    pickable: true,
    pointType: 'circle',
    lineWidthUnits: 'pixels',
    lineWidthScale: 1,
    pointRadiusUnits: 'pixels',
    pointRadiusScale: 1,
    // Define default colors and widths
    getFillColor: options.getFillColor ?? [34, 139, 34, 200], // green with alpha
    getLineColor: options.getLineColor ?? [255, 255, 255, 180], // white with alpha
    getLineWidth: options.getLineWidth ?? 1,
    getRadius: options.getPointRadius ?? 5,
    // Event handlers
    onClick: options.onClick,
    onHover: options.onHover,
    // Configure the MVT loading options
    loadOptions: {
      mvt: {
        tileSize: 256,
        maxZoom: options.maxZoom ?? 16,
        buffer: 64,
        extent: 4096,
        layerName: options.sourceLayer ?? 'trees',
        workerUrl: ''
      }
    },
    // Spread any additional paint properties
    ...options.paint,
    // Define update triggers
    updateTriggers: {
      getFillColor: [options.paint?.['circle-color']],
      getLineColor: [options.paint?.['line-color']],
      getLineWidth: [options.paint?.['line-width']],
      getRadius: [options.paint?.['circle-radius']],
    },
  });
}
