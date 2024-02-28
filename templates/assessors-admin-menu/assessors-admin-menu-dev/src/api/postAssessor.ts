import { api } from '../clients';
import { Assessor } from '../types';

async function postAsssessor(assessor: Assessor) {
  try {
    const { data: assessorId } = await api.post<string>('/post-assessor.php', {
      assessor,
    });

    return assessorId;
  } catch (err) {
    return Promise.reject(err);
  }
}

export default postAsssessor;
