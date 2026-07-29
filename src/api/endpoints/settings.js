import * as mockApi from '../mockApi';

const TABLE = 'settings';

export const settingsApi = {
  get: async () => {
    const list = await mockApi.list(TABLE);
    return list.data[0] || null;
  },
  update: async (patch) => {
    const list = await mockApi.list(TABLE);
    if (list.data.length > 0) {
      return mockApi.update(TABLE, list.data[0].id, patch);
    } else {
      return mockApi.create(TABLE, patch);
    }
  },
};
