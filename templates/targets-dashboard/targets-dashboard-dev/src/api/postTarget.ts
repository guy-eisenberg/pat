import { api } from '../client';
import { TargetData } from '../types';

async function postTarget(target: TargetData) {
  try {
    return await api.post('post-target.php', { target });
  } catch (err) {
    return Promise.reject(err);
  }
}

export default postTarget;
