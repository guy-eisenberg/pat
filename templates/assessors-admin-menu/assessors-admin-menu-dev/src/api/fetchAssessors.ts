import { api } from '../clients';
import type { Assessor } from '../types';

async function fetchAssessors() {
  try {
    const { data: assessors } = await api.get<Assessor[]>(
      `/get-all-assessors.php`
    );

    return assessors;
  } catch (err) {
    return Promise.reject(err);
  }
}

export default fetchAssessors;
