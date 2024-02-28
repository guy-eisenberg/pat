import { api } from '../clients';
import { Strategy } from '../types';

async function fetchStrategy() {
  try {
    const { data: strategy } = await api.get<Strategy>(
      '/get-user-strategy.php'
    );

    if (strategy) {
      strategy.assessor_color = strategy.assessor_color || '#000';
    }

    return strategy;
  } catch (err) {
    return Promise.reject(err);
  }
}

export default fetchStrategy;
