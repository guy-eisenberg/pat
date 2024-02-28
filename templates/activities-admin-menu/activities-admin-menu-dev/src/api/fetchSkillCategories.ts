import { api } from '../clients';
import { SkillCategory } from '../types';

async function fetchSkillCategories() {
  try {
    const { data: skillCategories } = await api.get<SkillCategory[]>(
      '/get-all-skill-categories.php'
    );

    return skillCategories;
  } catch (err) {
    return Promise.reject(err);
  }
}

export default fetchSkillCategories;
