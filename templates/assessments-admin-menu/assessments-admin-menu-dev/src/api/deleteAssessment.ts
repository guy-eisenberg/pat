import { api } from '../clients';

async function deleteAssessment(assessmentId: string) {
  try {
    return await api.delete(`delete-assessment.php?id=${assessmentId}`);
  } catch (err) {
    return Promise.reject(err);
  }
}

export default deleteAssessment;
