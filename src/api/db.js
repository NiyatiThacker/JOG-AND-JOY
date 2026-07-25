const NAMESPACE = 'jogjoy_admin_db_v1';

function readTable(table) {
  const raw = localStorage.getItem(`${NAMESPACE}:${table}`);
  return raw ? JSON.parse(raw) : [];
}

function writeTable(table, records) {
  localStorage.setItem(`${NAMESPACE}:${table}`, JSON.stringify(records));
}

export const Db = { readTable, writeTable };
