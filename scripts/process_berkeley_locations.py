import json
from pathlib import Path

# Input/output paths
INFILE = Path("data/openmap/berkeley-bldgs.geojson")
OUTFILE = Path("public/data/locations.geojson")

# Properties to keep
KEEP_PROPS = [
    'name',
    'building',
    'operator:type',
    'building:levels',
    'building:material',
    'addr:housename',
    'wheelchair',
    'smoking',
    'leisure',
]

def load_geojson(path):
    with open(path, 'r') as f:
        return json.load(f)

def filter_properties(props):
    return {k: v for k, v in props.items() if k in KEEP_PROPS}

def process_features(features):
    new_features = []
    for f in features:
        geom = f.get('geometry')
        if geom is None:
            continue
        props = f.get('properties', {})
        filtered = filter_properties(props)
        new_features.append({
            'type': 'Feature',
            'geometry': geom,
            'properties': filtered
        })
    return new_features

def main():
    geojson = load_geojson(INFILE)
    features = geojson.get('features', [])
    out_features = process_features(features)
    out_geojson = {
        'type': 'FeatureCollection',
        'features': out_features
    }
    OUTFILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTFILE, 'w') as f:
        json.dump(out_geojson, f, indent=2)
    print(f"Wrote {len(out_features)} features to {OUTFILE}")

if __name__ == "__main__":
    main()
