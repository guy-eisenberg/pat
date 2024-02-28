export type ActivatedTab = 'activities' | 'acticles' | 'targets';

export interface Strategy {
  id: string;
  first_name?: string;
  assessor_name: string;
  assessor_color: string;
  assessor_image_prep: string;
  assessment_date: number;
  focus_assessment_name: string;
  skill_categories_names: string[];
  activities: Activity[];
  articles: Article[];
  targets: Target[];
}

export interface Activity {
  id: string;
  name: string;
  image: string;
  description: string;
  page_hyperlink: string;
  segment: 'prepare' | 'weakness';
}

export interface Article {
  id: string;
  name: string;
  href: string;
  segment: 'prepare' | 'weakness';
}

export interface Target {
  id: string;
  name: string;
  figure: number;
  type: 'time' | 'score' | 'improvement';
  target_type: 'activity' | 'skill';
  end_time: number;
  segment: 'prepare' | 'weakness';
}
