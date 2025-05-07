// AirNow Adapter
import type { AQReading } from '../../types/data.interfaces';

interface AirNowAPIResponse {
  DateObserved: string;
  HourObserved: number;
  ParameterName: string;
  AQI: number;
  CategoryNumber: number;
  ReportingArea: string;
  // Add other relevant properties
}

class AirNowAdapter {
  async processAirNowResponse(response: any): Promise<AQReading[]> {
    const aqReadings: AQReading[] = [];

    response.forEach((observation: AirNowAPIResponse) => {
      const aqReading: AQReading = {
        location: [0, 0], // Placeholder, actual coordinates should be used
        timestamp: `${observation.DateObserved}T${observation.HourObserved}:00:00Z`,
        parameter: observation.ParameterName,
        value: observation.AQI,
        unit: 'AQI',
        source: `AirNow API (Station: ${observation.ReportingArea})`,
        isBaseline: true,
        id: `baseline-aq-${aqReadings.length + 1}`,
      };

      aqReadings.push(aqReading);
    });

    return aqReadings;
  }
}

export default AirNowAdapter;