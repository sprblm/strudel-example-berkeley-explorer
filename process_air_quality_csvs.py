import os
import csv
import json

input_dir = "data/unprocessed_csv"
output_file = "data/processed/berkeley_air_quality_all_readings.json"
os.makedirs(os.path.dirname(output_file), exist_ok=True)

all_readings = []

for fname in os.listdir(input_dir):
    if not fname.endswith(".csv"):
        continue
    with open(os.path.join(input_dir, fname), newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            # Clean and select relevant fields
            reading = {
                "location_id": row.get("location_id"),
                "location_name": row.get("location_name"),
                "parameter": row.get("parameter"),
                "value": float(row.get("value")) if row.get("value") else None,
                "unit": row.get("unit"),
                "datetimeUtc": row.get("datetimeUtc"),
                "latitude": float(row.get("latitude")) if row.get("latitude") else None,
                "longitude": float(row.get("longitude")) if row.get("longitude") else None,
                "provider": row.get("provider"),
            }
            all_readings.append(reading)

print(f"Total readings combined: {len(all_readings)}")
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(all_readings, f, indent=2)

print(f"Wrote {output_file}")