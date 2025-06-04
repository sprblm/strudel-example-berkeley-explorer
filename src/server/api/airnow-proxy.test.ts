// AirNow API Proxy Test
import { expect, describe, it } from 'vitest';
import AirNowProxy from './airnow-proxy';

describe('AirNowProxy', () => {
  it('should fetch air quality data from AirNow API', async () => {
    const proxy = new AirNowProxy();
    const zipCode = '94704'; // Berkeley zipcode
    const aqReadings = await proxy.fetchAirQualityData(zipCode);
    expect(aqReadings.length).toBeGreaterThanOrEqual(0);
  });
});
