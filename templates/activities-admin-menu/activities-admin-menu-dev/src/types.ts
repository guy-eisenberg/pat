export interface Activity {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  page_hyperlink: string;
  run_hyperlink: string;
  description?: string;
  image?: string;
  skill_categories: SkillCategory[];
}

export interface SkillCategory {
  id: string;
  name: string;
}
