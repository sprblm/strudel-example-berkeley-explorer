import Dexie from 'dexie';

export interface CachedTree {
  id: string;
  data: any;
}

export interface CachedAirQuality {
  id: string;
  data: any;
}

class BerkeleyDexie extends Dexie {
  trees: Dexie.Table<CachedTree, string>;
  airQuality: Dexie.Table<CachedAirQuality, string>;

  constructor() {
    super('BerkeleyEnvHealthDB');
    this.version(1).stores({
      trees: 'id',
      airQuality: 'id',
    });
    this.trees = this.table('trees');
    this.airQuality = this.table('airQuality');
  }
}

const db = new BerkeleyDexie();

export async function getCachedTrees(key = 'main') {
  const result = await db.trees.get(key);
  console.log('[Dexie] getCachedTrees', key, result);
  return result;
}

export async function setCachedTrees(data: any, key = 'main') {
  const result = await db.trees.put({ id: key, data });
  console.log('[Dexie] setCachedTrees', key, result);
  return result;
}

export async function getCachedAirQuality(key = 'main') {
  const result = await db.airQuality.get(key);
  console.log('[Dexie] getCachedAirQuality', key, result);
  return result;
}

export async function setCachedAirQuality(data: any, key = 'main') {
  const result = await db.airQuality.put({ id: key, data });
  console.log('[Dexie] setCachedAirQuality', key, result);
  return result;
}

