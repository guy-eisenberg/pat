import { api } from '../clients';
import type { OverallPerformance } from '../types';

async function fetchActivityPerformance() {
  try {
    const { data: performance } = await api.get<OverallPerformance>(
      '/get-user-overall-performance.php'
    );

    return performance;
  } catch (err) {
    return Promise.reject(err);
  }
}

export default fetchActivityPerformance;
