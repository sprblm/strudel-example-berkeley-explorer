/**
 * Utility functions for geographic operations
 */

/**
 * Checks if a point is inside a polygon using the ray casting algorithm
 * @param point [longitude, latitude] coordinates
 * @param polygon Array of [longitude, latitude] coordinates forming a polygon
 * @returns boolean indicating if the point is inside the polygon
 */
export function isPointInPolygon(
  point: [number, number],
  polygon: [number, number][]
): boolean {
  // Ray casting algorithm
  const x = point[0];
  const y = point[1];

  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Loads a GeoJSON boundary file and returns a function that checks if a point is within that boundary
 * @param boundaryPath Path to the GeoJSON boundary file
 * @returns A function that takes a point [longitude, latitude] and returns boolean
 */
export async function createBoundaryChecker(
  boundaryPath: string
): Promise<(point: [number, number]) => boolean> {
  try {
    const response = await fetch(boundaryPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch boundary data: ${response.status}`);
    }

    const boundaryData = await response.json();

    // Extract the first polygon from the GeoJSON
    if (boundaryData.features && boundaryData.features.length > 0) {
      const feature = boundaryData.features[0];
      if (feature.geometry && feature.geometry.type === 'Polygon') {
        const polygon = feature.geometry.coordinates[0];

        // Return a function that checks if a point is in this polygon
        return (point: [number, number]) => isPointInPolygon(point, polygon);
      }
    }

    throw new Error('Invalid boundary data format');
  } catch (error) {
    console.error('Error loading boundary data:', error);
    // Return a function that always returns true as fallback
    return () => true;
  }
}

/**
 * Example usage:
 *
 * // In an async function:
 * const isBerkeleyPoint = await createBoundaryChecker('/data/boundaries/berkeley_city_boundary.json');
 *
 * // Then use it to check points:
 * const isInBerkeley = isBerkeleyPoint([-122.2730, 37.8715]);
 */
