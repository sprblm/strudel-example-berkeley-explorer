// Berkeley City Trees Adapter
import type { TreeObservation } from '../../types/data.interfaces';

interface BerkeleyCityTreesFeature {
  geometry: {
    coordinates: number[];
  };
  properties: {
    SPP_NAME?: string;
    COMMON_NAM?: string;
    DBH: number;
    CONDITION: string;
    // Add other relevant properties
  };
}

class BerkeleyCityTreesAdapter {
  async processGeoJSON(geoJSON: any): Promise<TreeObservation[]> {
    const treeObservations: TreeObservation[] = [];

    geoJSON.features.forEach((feature: BerkeleyCityTreesFeature) => {
      const treeObservation: TreeObservation = {
        location: [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
        species: feature.properties.SPP_NAME || feature.properties.COMMON_NAM || 'Unknown',
        dbh: feature.properties.DBH,
        healthCondition: this.standardizeHealthCondition(feature.properties.CONDITION),
        observationDate: '2013-04-30',
        source: 'UCB Geodata Library (2013 Inventory)',
        isBaseline: true,
        id: `baseline-tree-${treeObservations.length + 1}`,
      };

      treeObservations.push(treeObservation);
    });

    return treeObservations;
  }

  private standardizeHealthCondition(condition: string): string {
    // Implement logic to standardize health condition
    return condition; // For now, just return the condition as is
  }
}

export default BerkeleyCityTreesAdapter;