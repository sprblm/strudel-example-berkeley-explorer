// Berkeley City Trees Adapter
import type { TreeObservation } from '../../types/data.interfaces';

interface BerkeleyCityTreesFeature {
  geometry: {
    coordinates: number[];
  };
  properties: {
    SPECIES?: string;
    Common_Nam?: string;
    ITREE?: string;
    DBH_IN?: number;
    CONDITION?: string;
    HEIGHT_FT?: number;
    SPREAD_FT?: number;
    LOCATION?: string;
    NOTE?: string;
  };
}

class BerkeleyCityTreesAdapter {
  async processGeoJSON(geoJSON: any): Promise<TreeObservation[]> {
    const treeObservations: TreeObservation[] = [];

    geoJSON.features.forEach((feature: BerkeleyCityTreesFeature) => {
      // Skip planting sites (no actual tree)
      if (feature.properties.SPECIES === 'Planting Site') {
        return;
      }

      const treeObservation: TreeObservation = {
        location: [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
        species: feature.properties.SPECIES || feature.properties.Common_Nam || 'Unknown',
        dbh: feature.properties.DBH_IN || 0,
        healthCondition: this.standardizeHealthCondition(feature.properties.CONDITION || ''),
        observationDate: '2013-04-30',
        source: 'UCB Geodata Library (2013 Inventory)',
        isBaseline: true,
        id: `baseline-tree-${treeObservations.length + 1}`,
        // Add additional properties
        height: feature.properties.HEIGHT_FT,
        spread: feature.properties.SPREAD_FT,
        location_type: feature.properties.LOCATION,
        notes: feature.properties.NOTE
      };

      treeObservations.push(treeObservation);
    });

    return treeObservations;
  }

  private standardizeHealthCondition(condition: string): string {
    if (!condition || condition === 'NA') return 'Unknown';
    
    // The condition appears to be a numeric rating (0-100)
    // Could map to categories like Poor (0-25), Fair (26-50), Good (51-75), Excellent (76-100)
    const conditionNum = parseInt(condition, 10);
    if (isNaN(conditionNum)) return condition;
    
    if (conditionNum <= 25) return 'Poor';
    if (conditionNum <= 50) return 'Fair';
    if (conditionNum <= 75) return 'Good';
    return 'Excellent';
  }
}

export default BerkeleyCityTreesAdapter;