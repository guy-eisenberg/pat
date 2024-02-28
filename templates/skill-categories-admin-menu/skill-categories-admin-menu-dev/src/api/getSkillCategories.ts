import { api } from '../clients';
import type { SkillCategory } from '../types';

async function getSkillCategories(): Promise<SkillCategory[]> {
  try {
    const { data } = await api.get('/skill_categories.php');

    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}

export default getSkillCategories;
