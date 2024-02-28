import { api } from '../clients';
import { Activity } from '../types';

async function postActivity(activity: Activity) {
  try {
    const { data: activityId } = await api.post<string>('/post-activity.php', {
      activity,
    });

    return activityId;
  } catch (err) {
    return Promise.reject(err);
  }
}

export default postActivity;
