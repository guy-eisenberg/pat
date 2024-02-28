import { api } from '../clients';
import type { Activity } from '../types';

async function fetchActivities() {
  try {
    const { data: activities } = await api.get<Activity[]>(
      `/get-all-activities.php`
    );

    return activities;
  } catch (err) {
    return Promise.reject(err);
  }
}

export default fetchActivities;
