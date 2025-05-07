// AirNow API Proxy
import axios from 'axios';
import AirNowAdapter from '../../services/data-sources/airnow-adapter';

const airNowAPI = axios.create({
  baseURL: 'https://www.airnowapi.org/aq/observation/zipCode/current',
  params: {
    API_KEY: '6B09E99E-9B24-4971-9ADE-B35ED1DEF3EB', // Using the provided API key for testing
  },
});

class AirNowProxy {
  async fetchAirQualityData(zipCode: string) {
    try {
      const response = await airNowAPI.get('', {
        params: {
          zipCode: zipCode,
          format: 'application/json', // Specify JSON format
          distance: 25, // Example distance
        },
      });

      const adapter = new AirNowAdapter();
      const aqReadings = await adapter.processAirNowResponse(response.data);

      return aqReadings;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error fetching AirNow data:', error.message, error.response?.status);
        throw new Error(`Failed to fetch AirNow data: ${error.message}`);
      } else {
        console.error('Unexpected error fetching AirNow data:', error);
        throw error;
      }
    }
  }
}

export default AirNowProxy;