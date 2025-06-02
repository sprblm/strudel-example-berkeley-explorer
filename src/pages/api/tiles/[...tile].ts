/**
 * Tile API endpoint handler for serving map vector tiles.
 * Handles requests for map tiles, serving the appropriate tile data from the filesystem.
 * Supports handling compressed (gzipped) tiles for improved performance.
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import { promisify } from 'util';
import zlib from 'zlib';

const gunzip = promisify(zlib.gunzip);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tile } = req.query;
  
  try {
    // Handle the case where tile is a string (single segment) or array (multiple segments)
    const tilePath = Array.isArray(tile) 
      ? path.join(process.cwd(), 'public', 'tiles', 'tiles', ...tile)
      : path.join(process.cwd(), 'public', 'tiles', 'tiles', tile);
    
    // Read the tile file
    let tileData = await fs.readFile(tilePath);
    
    // If the file is gzipped, unzip it
    if (tilePath.endsWith('.pbf')) {
      tileData = await gunzip(tileData);
    }
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/x-protobuf');
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    
    // Send the tile data
    res.send(tileData);
  } catch (error) {
    console.error('Error serving tile:', error);
    res.status(404).json({ error: 'Tile not found' });
  }
}
