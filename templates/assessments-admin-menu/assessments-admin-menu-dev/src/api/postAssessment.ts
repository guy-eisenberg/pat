import { api } from '../clients';
import { Assessment } from '../types';

async function postAssessment(assessment: Assessment) {
  try {
    const { data: assessmentId } = await api.post<string>(
      '/post-assessment.php',
      {
        assessment,
      }
    );

    return assessmentId;
  } catch (err) {
    return Promise.reject(err);
  }
}

export default postAssessment;
