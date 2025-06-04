// Contribute Data API Endpoint
import express, { Request, Response, RequestHandler } from 'express';
import { TreeObservation } from '../../types/data.interfaces';
import db from '../db';

const router = express.Router();

const contributeDataHandler: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      location,
      species,
      dbh,
      healthCondition,
      observationDate,
      photos,
      notes,
    } = req.body;

    // Validate the data
    if (!location || !species || !dbh || !healthCondition || !observationDate) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Geofencing validation
    if (!isWithinCampus(location)) {
      res.status(400).json({ error: 'Location is not within the campus area' });
      return;
    }

    // Create a new TreeObservation object
    const treeObservation: TreeObservation = {
      location,
      species,
      dbh: Number(dbh),
      healthCondition,
      observationDate,
      source: 'User Contribution',
      isBaseline: false,
      id: `contrib-tree-${Date.now()}`,
      photos,
      notes,
    };

    // Save the data to the database
    db.run(
      `
      INSERT INTO tree_observations (id, location, species, dbh, healthCondition, observationDate, source, isBaseline, photos, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        treeObservation.id,
        JSON.stringify(treeObservation.location),
        treeObservation.species,
        treeObservation.dbh,
        treeObservation.healthCondition,
        treeObservation.observationDate,
        treeObservation.source,
        treeObservation.isBaseline ? 1 : 0,
        treeObservation.photos ? JSON.stringify(treeObservation.photos) : null,
        treeObservation.notes,
      ],
      (err) => {
        if (err) {
          console.error('Error saving data:', err);
          res.status(500).json({ error: 'Failed to save data' });
        } else {
          res.json({ message: 'Data submitted successfully' });
        }
      }
    );
  } catch (error) {
    console.error('Error handling contribute data request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

router.post('/contribute', contributeDataHandler);
// Remove the duplicate declaration

const campusBoundary = [
  [-122.272743, 37.871592],
  [-122.265, 37.871],
  [-122.262, 37.875],
  [-122.268, 37.878],
  [-122.272743, 37.871592], // Closing the polygon
];

const isWithinCampus = (location: number[]) => {
  const longitude = location[0];
  const latitude = location[1];
  let inside = false;
  for (
    let i = 0, j = campusBoundary.length - 1;
    i < campusBoundary.length;
    j = i++
  ) {
    const xi = campusBoundary[i][0],
      yi = campusBoundary[i][1];
    const xj = campusBoundary[j][0],
      yj = campusBoundary[j][1];

    const intersect =
      yi > latitude !== yj > latitude &&
      longitude < ((xj - xi) * (latitude - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

export default router;
