import { Db } from '../db';

const TABLE = 'settings';

async function simulateNetwork() {
  return new Promise((r) => setTimeout(r, 200));
}

export const settingsApi = {
  async get() {
    await simulateNetwork();
    const rows = Db.readTable(TABLE);
    return rows[0] ?? null;
  },
  async update(patch) {
    await simulateNetwork();
    const rows = Db.readTable(TABLE);
    const current = rows[0] ?? {};
    const updated = { ...current, ...patch };
    Db.writeTable(TABLE, [updated]);
    return updated;
  },
};
