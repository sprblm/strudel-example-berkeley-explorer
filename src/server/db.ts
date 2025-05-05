import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./contributions.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tree_observations (
      id TEXT PRIMARY KEY,
      location TEXT,
      species TEXT,
      dbh REAL,
      healthCondition TEXT,
      observationDate TEXT,
      source TEXT,
      isBaseline INTEGER,
      photos TEXT,
      notes TEXT
    )
  `);
});

export default db;
