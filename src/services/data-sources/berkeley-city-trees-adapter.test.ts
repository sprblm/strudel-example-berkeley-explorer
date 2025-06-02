// Berkeley City Trees Adapter Test
import { expect, describe, it } from 'vitest';
import BerkeleyCityTreesAdapter from './berkeley-city-trees-adapter';

describe('BerkeleyCityTreesAdapter', () => {
  it('should process GeoJSON and map to TreeObservation', async () => {
    const adapter = new BerkeleyCityTreesAdapter();
    const geoJSON = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-122.272743, 37.871592],
          },
          properties: {
            SPECIES: 'Quercus agrifolia',
            Common_Nam: 'Coast Live Oak',
            DBH_IN: 30,
            CONDITION: 'Good',
          },
        },
      ],
    };

    const treeObservations = await adapter.processGeoJSON(geoJSON);
    expect(treeObservations.length).toBe(1);
    expect(treeObservations[0].species).toBe('Quercus agrifolia');
    expect(treeObservations[0].dbh).toBe(30);
    expect(treeObservations[0].healthCondition).toBe('Good');
  });
});