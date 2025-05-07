import fs from 'fs';
import path from 'path';
import BerkeleyCityTreesAdapter from '../src/services/data-sources/berkeley-city-trees-adapter';

// Paths
const dataDir = path.join(__dirname, '../data/berkeley-tree-inventory');
const outputDir = path.join(__dirname, '../data/processed');
const mainTreeFile = path.join(dataDir, 'berkeley-s7gq2s-geojson.json');
const outputFile = path.join(outputDir, 'berkeley_trees_processed.json');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function processTreeData() {
  console.log('Loading Berkeley tree inventory data...');
  
  try {
    // Read the GeoJSON file
    const rawData = fs.readFileSync(mainTreeFile, 'utf8');
    const geoJSON = JSON.parse(rawData);
    
    // Process using the adapter
    const adapter = new BerkeleyCityTreesAdapter();
    const treeObservations = await adapter.processGeoJSON(geoJSON);
    
    // Save processed data
    fs.writeFileSync(outputFile, JSON.stringify(treeObservations, null, 2));
    
    console.log(`Successfully processed ${treeObservations.length} trees`);
    console.log(`Saved to: ${outputFile}`);
    
    // Generate some basic statistics
    const speciesCounts = treeObservations.reduce((acc, tree) => {
      acc[tree.species] = (acc[tree.species] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topSpecies = Object.entries(speciesCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    console.log('\nTop 10 tree species in Berkeley:');
    topSpecies.forEach(([species, count]) => {
      console.log(`${species}: ${count} trees`);
    });
    
  } catch (error) {
    console.error('Error processing tree data:', error);
  }
}

processTreeData();
