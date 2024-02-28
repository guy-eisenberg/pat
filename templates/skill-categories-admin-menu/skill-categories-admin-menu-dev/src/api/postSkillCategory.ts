import { api } from '../clients';
import { SkillCategory } from '../types';

async function postSkillCategory(skillCategory: SkillCategory) {
  try {
    return api.post('/skill_categories.php', {
      skill_category: skillCategory,
    });
  } catch (err) {
    return Promise.reject(err);
  }
}

export default postSkillCategory;
