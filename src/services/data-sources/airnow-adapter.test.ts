// AirNow Adapter Test
import { expect, describe, it } from 'vitest';
import AirNowAdapter from './airnow-adapter';

describe('AirNowAdapter', () => {
  it('should process AirNow API response and map to AQReading', async () => {
    const adapter = new AirNowAdapter();
    const airNowResponse = [
      {
        DateObserved: '2023-04-30',
        HourObserved: 12,
        ParameterName: 'PM2.5',
        AQI: 50,
        ReportingArea: 'Campus',
      },
    ];

    const aqReadings = await adapter.processAirNowResponse(airNowResponse);
    expect(aqReadings.length).toBe(1);
    expect(aqReadings[0].parameter).toBe('PM2.5');
    expect(aqReadings[0].value).toBe(50);
    expect(aqReadings[0].source).toBe('AirNow API (Station: Campus)');
  });
});
