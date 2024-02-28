import { api } from '../clients';

async function deleteSkillCategory(skillCategoryId: string) {
  try {
    return await api.delete(`/skill_categories.php?id=${skillCategoryId}`);
  } catch (err) {
    return Promise.reject(err);
  }
}

export default deleteSkillCategory;
