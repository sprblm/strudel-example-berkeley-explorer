// Data Interfaces
interface TreeObservation {
  location: number[];
  species: string;
  dbh: number;
  healthCondition: string;
  observationDate: string;
  source: string;
  isBaseline: boolean;
  id: string;
  photos?: string[];
  notes?: string;
}

interface AQReading {
  location: number[];
  timestamp: string;
  parameter: string;
  value: number;
  unit: string;
  source: string;
  isBaseline: boolean;
  id: string;
  // Add other relevant properties
}

export type { TreeObservation, AQReading };
