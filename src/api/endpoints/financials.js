import { Db } from '../db';
import { computeRevenueSummary, computePayoutSchedule } from '../../utils/selectors';

export const financialsApi = {
  async getSummary({ from, to } = {}) {
    const orders = Db.readTable('orders');
    return computeRevenueSummary(orders, { from, to });
  },
  async getPayouts() {
    return Db.readTable('payouts');
  },
};
