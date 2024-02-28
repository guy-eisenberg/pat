import { api } from '../clients';
import type { Strategy } from '../types';

async function fetchActivityPerformance() {
  try {
    const { data: strategy } = await api.get<Strategy>(
      '/get-user-strategy.php'
    );

    return strategy;
  } catch (err) {
    return Promise.reject(err);
  }
}

export default fetchActivityPerformance;
