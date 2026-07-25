import { Db } from './db';
import { nanoid } from 'nanoid';

const LATENCY_MS = 350;
const ERROR_RATE = 0; // set to e.g. 0.05 in dev to test error handling paths

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function simulateNetwork() {
  await delay(LATENCY_MS + Math.random() * 200);
  if (Math.random() < ERROR_RATE) {
    throw new Error('Simulated network error');
  }
}

export async function list(table, params = {}) {
  await simulateNetwork();
  let records = Db.readTable(table);
  const { page = 1, pageSize = 20, sort, ...filters } = params;

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === '' || value === null) return;
    if (key === 'search') {
      const q = String(value).toLowerCase();
      records = records.filter((r) =>
        JSON.stringify(r).toLowerCase().includes(q)
      );
    } else {
      records = records.filter((r) => r[key] === value);
    }
  });

  if (sort) {
    const dir = sort.startsWith('-') ? -1 : 1;
    const key = sort.replace('-', '');
    records = [...records].sort((a, b) => (a[key] > b[key] ? dir : -dir));
  }

  const total = records.length;
  const start = (page - 1) * pageSize;
  const data = records.slice(start, start + pageSize);
  return { data, total, page, pageSize };
}

export async function get(table, id) {
  await simulateNetwork();
  const records = Db.readTable(table);
  const record = records.find((r) => r.id === id);
  if (!record) throw new Error(`${table} record ${id} not found`);
  return record;
}

export async function create(table, payload) {
  await simulateNetwork();
  const records = Db.readTable(table);
  const now = new Date().toISOString();
  const record = { id: nanoid(), createdAt: now, updatedAt: now, ...payload };
  records.push(record);
  Db.writeTable(table, records);
  return record;
}

export async function update(table, id, patch) {
  await simulateNetwork();
  const records = Db.readTable(table);
  const idx = records.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error(`${table} record ${id} not found`);
  records[idx] = { ...records[idx], ...patch, updatedAt: new Date().toISOString() };
  Db.writeTable(table, records);
  return records[idx];
}

export async function remove(table, id) {
  await simulateNetwork();
  const records = Db.readTable(table).filter((r) => r.id !== id);
  Db.writeTable(table, records);
  return { id };
}
