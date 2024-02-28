import { api } from '../clients';
import type { Performance } from '../types';

async function fetchActivityPerformance(activity?: string) {
  try {
    const { data: performance } = await api.get<Performance>(
      `/get-user-activity-performance.php${
        activity ? `?activity=${activity}` : ''
      }`
    );

    return performance;
  } catch (err) {
    return Promise.reject(err);
  }
}

export default fetchActivityPerformance;
