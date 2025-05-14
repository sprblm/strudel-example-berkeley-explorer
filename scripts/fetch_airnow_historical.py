import requests
import datetime
import time
import json
import os
import random
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Configuration
API_KEY = os.getenv("AIRNOW_API_KEY")
if not API_KEY or not API_KEY.strip():
    raise RuntimeError("AIRNOW_API_KEY is not set or is empty. Please check your environment variables or .env file.")

# Bounding box for wider Bay Area (SF, Oakland, Berkeley, etc.)
# Format: minLong,minLat,maxLong,maxLat
BBOX = "-122.75,37.3,-121.75,38.0"

# Using data endpoint instead of latLong for retrieving multiple stations
BASE_URL = "https://www.airnowapi.org/aq/data/"
DATA_DIR = Path("data/airnow")
OUTPUT_FILE = DATA_DIR / "airnow_bay_area_400days.json"
TEMP_FILE = DATA_DIR / "airnow_bay_area_temp.json"
START_DATE = datetime.date(2025, 5, 12)
DAYS = 400
PARAMETERS = "OZONE,PM25"  # Parameters to query for
RATE_LIMIT_DELAY = 3  # Seconds between requests (more conservative)
MAX_RETRIES = 3

# Create data directory if it doesn't exist
os.makedirs(DATA_DIR, exist_ok=True)

# Load existing data if available (for resuming)
all_results = []
last_processed_day = -1
if os.path.exists(TEMP_FILE):
    try:
        with open(TEMP_FILE, "r") as f:
            temp_data = json.load(f)
            all_results = temp_data.get("results", [])
            last_processed_day = temp_data.get("last_day", -1)
            print(f"Resuming from day {last_processed_day+1}, with {len(all_results)} records already collected.")
    except Exception as e:
        print(f"Error loading temp file: {e}")

# Process each day
for i in range(DAYS):
    # Skip already processed days if resuming
    if i <= last_processed_day:
        continue
        
    # Calculate start and end date for the current day
    date = START_DATE - datetime.timedelta(days=i)
    start_date_str = date.strftime("%Y-%m-%dT00")
    end_date_str = date.strftime("%Y-%m-%dT23")  # Get full 24 hours of data
    
    params = {
        "startDate": start_date_str,
        "endDate": end_date_str,
        "parameters": PARAMETERS,
        "BBOX": BBOX,  # Wider bounding box for more stations
        "dataType": "B",  # B = Both AQI and concentration
        "format": "application/json",
        "API_KEY": API_KEY
    }
    
    # Try with retries
    success = False
    retries = 0
    while not success and retries < MAX_RETRIES:
        try:
            print(f"Fetching data for {start_date_str} (attempt {retries+1})...")
            if i == 0 and retries == 0:
                print(f"DEBUG: Request URL: {BASE_URL}")
                print(f"DEBUG: Params: {params}")
                print(f"DEBUG: API_KEY (first 8 chars): {API_KEY[:8]}")
            response = requests.get(BASE_URL, params=params)
            if response.status_code >= 400:
                print(f"DEBUG: Response content: {response.text}")
            
            # Handle rate limiting specifically
            if response.status_code == 429:
                retry_after = int(response.headers.get('Retry-After', RATE_LIMIT_DELAY * 2))
                print(f"Rate limited. Waiting {retry_after} seconds...")
                time.sleep(retry_after)
                retries += 1
                continue
                
            response.raise_for_status()
            data = response.json()
            if data:
                # Extract unique stations from the response
                stations = set()
                for item in data:
                    # Updated: using 'ParameterName' key as per new JSON structure
                    parameter = item.get('ParameterName')
                    station_key = (item.get('Latitude'), item.get('Longitude'))
                    stations.add(station_key)
                
                # Log station information
                print(f"Fetched data for {start_date_str}: {len(data)} records from {len(stations)} unique stations.")
                if i == 0:  # Only print detailed station info for the first day
                    print("Stations found:")
                    for idx, (lat, lon) in enumerate(stations):
                        print(f"  Station {idx+1}: Lat {lat}, Lon {lon}")
                
                all_results.extend(data)
            else:
                print(f"No data returned for {start_date_str}.")
            success = True
            
            # Save progress after each successful day
            with open(TEMP_FILE, "w") as f:
                json.dump({"results": all_results, "last_day": i}, f)
                
        except requests.exceptions.HTTPError as e:
            print(f"HTTP Error for {start_date_str}: {e}")
            retries += 1
            time.sleep(RATE_LIMIT_DELAY * 2)  # Wait longer on HTTP errors
            
        except Exception as e:
            print(f"Error fetching data for {start_date_str}: {e}")
            retries += 1
            time.sleep(RATE_LIMIT_DELAY)
    
    if not success:
        print(f"Failed to fetch data for {start_date_str} after {MAX_RETRIES} attempts. Continuing...")
    
    # Add jitter to avoid hitting rate limits
    sleep_time = RATE_LIMIT_DELAY + random.uniform(0.5, 1.5)
    print(f"Waiting {sleep_time:.2f} seconds before next request...")
    time.sleep(sleep_time)

# Save final results
with open(OUTPUT_FILE, "w") as f:
    json.dump(all_results, f, indent=2)

# Clean up temp file if successful
if os.path.exists(TEMP_FILE):
    os.remove(TEMP_FILE)

# Count and report unique stations in the final dataset
unique_stations = set()
for item in all_results:
    station_key = (item.get('Latitude'), item.get('Longitude'))
    unique_stations.add(station_key)

print(f"Done! Compiled {len(all_results)} records from {len(unique_stations)} unique stations into {OUTPUT_FILE}.")
print("Unique station coordinates:")
for idx, (lat, lon) in enumerate(sorted(unique_stations)):
    print(f"  Station {idx+1}: Lat {lat}, Lon {lon}")
