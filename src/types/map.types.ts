/**
 * Map data types for Berkeley Environmental Health Explorer
 *
 * These types define the structure of data points displayed on the map
 * and used throughout the application.
 */

/**
 * Base interface for all map data points
 */
export interface BaseDataPoint {
  id: string;
  lat: number;
  lng: number;
  title: string;
}

/**
 * Tree data point interface
 *
 * Represents a tree on the map with its properties
 */
export interface TreeDataPoint extends BaseDataPoint {
  type: 'tree';
  category: string;
  health?: string;
  details: {
    species?: string;
    healthCondition?: string;
    dbh?: number | string;
    height?: number;
    observationDate?: string;
    [key: string]: any;
  };
}

/**
 * Air quality data point interface
 *
 * Represents an air quality monitoring station on the map
 */
export interface AirQualityDataPoint extends BaseDataPoint {
  type: 'air';
  value: number;
  unit: string;
  timestamp: string;
  details: {
    pollutant?: string;
    source?: string;
    [key: string]: any;
  };
}

/**
 * Location data point interface
 *
 * Represents a location of interest on the map
 */
export interface LocationDataPoint extends BaseDataPoint {
  type: 'location';
  category: string;
  details: {
    locationType?: string;
    address?: string;
    [key: string]: any;
  };
}

/**
 * Union type for all data points that can be displayed on the map
 */
export type DataPoint = TreeDataPoint | AirQualityDataPoint | LocationDataPoint;
