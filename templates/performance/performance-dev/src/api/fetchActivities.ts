import { api } from '../clients';
import type { SidebarActivity } from '../types';

async function fetchActivities() {
  try {
    const { data: activities } = await api.get<SidebarActivity[]>(
      '/get-all-sidebar-activities.php'
    );

    return activities;
  } catch (err) {
    return Promise.reject(err);
  }
}

export default fetchActivities;
