const fs = require('fs');
const path = require('path');

// Paths
const inputPath = path.join(__dirname, '../../public/data/processed/berkeley_trees_processed.json');
const outputPath = path.join(__dirname, '../../public/data/processed/trees.geojson');

// Read the processed tree data
console.log('Reading processed tree data...');
const treeData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

// Convert to GeoJSON FeatureCollection
console.log('Converting to GeoJSON...');
const geojson = {
  type: 'FeatureCollection',
  features: treeData
    .filter(tree => tree.location && Array.isArray(tree.location) && tree.location.length === 2)
    .map((tree, index) => ({
      type: 'Feature',
      id: index,
      properties: {
        id: tree.id || `tree-${index}`,
        species: tree.species || 'Unknown',
        health: tree.healthCondition || 'Unknown',
        dbh: tree.dbh,
        height: tree.height,
        spread: tree.spread,
        date: tree.observationDate
      },
      geometry: {
        type: 'Point',
        coordinates: [tree.location[0], tree.location[1]] // [lng, lat]
      }
    }))
};

// Write the GeoJSON file
console.log(`Writing GeoJSON to ${outputPath}...`);
fs.writeFileSync(outputPath, JSON.stringify(geojson));

console.log('Conversion complete!');
