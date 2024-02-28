import { api } from '../clients';

async function deleteAssessor(assessorId: string) {
  try {
    return await api.delete(`delete-assessor.php?id=${assessorId}`);
  } catch (err) {
    return Promise.reject(err);
  }
}

export default deleteAssessor;
