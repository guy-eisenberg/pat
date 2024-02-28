import { api } from '../client';

async function deleteTarget(targetId: string) {
  try {
    return await api.delete(`delete-target.php?id=${targetId}`);
  } catch (err) {
    return Promise.reject(err);
  }
}

export default deleteTarget;
