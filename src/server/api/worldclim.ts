import * as fs from 'fs';
import * as path from 'path';
import { Request, Response } from 'express';


const handler = async (req: Request, res: Response) => {
  try {
    const dataPath = path.join(process.cwd(), 'data/noaa/processed-data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(rawData);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export default handler;
