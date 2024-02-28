import { api } from '../clients';
import type { Assessment } from '../types';

async function fetchAssessments() {
  try {
    const { data: assessments } = await api.get<Assessment[]>(
      `/get-all-assessments.php`
    );

    return assessments;
  } catch (err) {
    return Promise.reject(err);
  }
}

export default fetchAssessments;
