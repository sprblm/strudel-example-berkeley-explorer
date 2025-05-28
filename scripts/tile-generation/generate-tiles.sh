#!/bin/bash

# Exit on error
set -e

# Check if Tippecanoe is installed
if ! command -v tippecanoe &> /dev/null; then
    echo "Error: Tippecanoe is not installed. Please install it first:"
    echo "  Mac: brew install tippecanoe"
    echo "  Linux: sudo apt-get install tippecanoe"
    exit 1
fi

# Create output directories
mkdir -p public/tiles

# Paths
GEOJSON_PATH="public/data/processed/trees.geojson"
OUTPUT_DIR="public/tiles"
TILESET_NAME="trees"

# Generate vector tiles
echo "Generating vector tiles..."
tippecanoe \
  --output="$OUTPUT_DIR/$TILESET_NAME.mbtiles" \
  --force \
  --drop-densest-as-needed \
  --extend-zooms-if-still-dropping \
  --no-tile-size-limit \
  --no-tile-compression \
  --maximum-zoom=16 \
  --minimum-zoom=0 \
  --layer="$TILESET_NAME" \
  "$GEOJSON_PATH"

# Extract mbtiles to directory structure
# First, install mb-util if not installed
if ! command -v mb-util &> /dev/null; then
    echo "Installing mb-util..."
    pip3 install --user mb-util
    export PATH="$HOME/Library/Python/3.9/bin:$PATH"
fi

echo "Extracting tiles..."
mb-util "$OUTPUT_DIR/$TILESET_NAME.mbtiles" "$OUTPUT_DIR/tiles" --image_format=pbf

# Clean up
rm "$OUTPUT_DIR/$TILESET_NAME.mbtiles"

echo "Tiles generated in $OUTPUT_DIR/tiles"
