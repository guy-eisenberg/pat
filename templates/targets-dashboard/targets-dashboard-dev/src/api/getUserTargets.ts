import { api } from '../client';
import { Target } from '../types';

async function getUserTargets() {
  try {
    const { data } = await api.get<{
      user_targets: Target[];
      available_targets: {
        key: string;
        label: string;
        type: 'activity' | 'skill';
      }[];
    }>('/get-user-targets.php');

    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}

export default getUserTargets;
