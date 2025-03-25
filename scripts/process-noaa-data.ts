import * as fs from 'fs';
import * as csv from 'csv-parser';

interface NOAAData {
  STATION: string;
  DATE: string;
  TEMP: string;
  DEWP: string;
}

const processCSV = (inputPath: string, outputPath: string) => {
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found at ${inputPath}`);
    console.log('Please ensure the NOAA CSV file is in the correct location');
    process.exit(1);
  }

  const results: NOAAData[] = [];
  fs.createReadStream(inputPath)
    .pipe(csv())
    .on('data', (data: NOAAData) => results.push(data))
    .on('end', () => {
      fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
      console.log(`Successfully processed ${results.length} records`);
      console.log(`Output saved to ${outputPath}`);
    });
};

processCSV('./data/noaa/01001099999.csv', './data/noaa/processed-data.json');
