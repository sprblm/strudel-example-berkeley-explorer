import requests
import datetime
import time
import json

API_KEY = "6B09E99E-9B24-4971-9ADE-B35ED1DEF3EB"
ZIP_CODE = "94720"
BASE_URL = "https://www.airnowapi.org/aq/observation/zipCode/historical/"
OUTPUT_FILE = "airnow_94720_400days.json"
START_DATE = datetime.date(2024, 5, 5)
DAYS = 400
DISTANCE = 25

all_results = []

for i in range(DAYS):
    date = START_DATE - datetime.timedelta(days=i)
    date_str = date.strftime("%Y-%m-%dT00-0000")
    params = {
        "format": "application/json",
        "zipCode": ZIP_CODE,
        "date": date_str,
        "distance": DISTANCE,
        "API_KEY": API_KEY
    }
    try:
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()
        if data:
            all_results.extend(data)
        print(f"Fetched data for {date_str}: {len(data)} records.")
    except Exception as e:
        print(f"Error fetching data for {date_str}: {e}")
    time.sleep(1)  # Be respectful to the API, avoid rate limits

with open(OUTPUT_FILE, "w") as f:
    json.dump(all_results, f, indent=2)

print(f"Done! Compiled {len(all_results)} records into {OUTPUT_FILE}.")
