import { api } from '../clients';

async function deleteActivity(activityId: string) {
  try {
    return await api.delete(`delete-activity.php?id=${activityId}`);
  } catch (err) {
    return Promise.reject(err);
  }
}

export default deleteActivity;
