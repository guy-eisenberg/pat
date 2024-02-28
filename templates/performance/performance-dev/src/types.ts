export type SortType = 'alphabet' | 'score' | 'recent' | 'time';

export type ImprovementRate = 'fast' | 'medium' | 'slow';

export type Median = 'below' | 'average' | 'above' | 'neutral';

export interface SidebarActivity {
  id: string;
  slug: string;
  short_name: string;
  name: string;
  focus: boolean;
  score: number | null;
  median: Median | null;
  last_use: number;
  legacy: boolean;
  page_hyperlink: string;
}

export interface Performance {
  score: number | null;
  median: Median;
  all_scores: number[] | null;
  scores_segments: number[] | null;
  overall_improvement: number | null;
  improvement_rate: number | null;
  improvement_rate_speed: ImprovementRate;
  total_duration: number | null;
  runs: number | null;
  previous_days_scores: number[] | null;
  targets: {
    active: number;
    achieved: number;
    missed: number;
  };
}

export interface Strategy {
  first_name: string;
  last_name: string;
  assessor_name: string;
  assessor_color: string;
  assessor_image: string;
  focus_assessment_name: string;
  activities: any[];
  articles: any[];
  targets: any[];
}

export type PerformanceType = 'activity' | 'skill';

export interface ActivityPerformance {
  id: string;
  name: string;
  short_name: string;
  total_duration: number;
  score: number | null;
  scores_segments: number[] | null;
  median: Median;
  last_use: number;
  focus: boolean;
  increased_improvement: boolean;
  increased_score: boolean;
  improvement_rate: number;
  improvement_rate_speed: ImprovementRate;
}

export type SkillPefromance = Omit<ActivityPerformance, 'focus'>;

export interface OverallPerformance extends Performance {
  activities: ActivityPerformance[];
  skills: SkillPefromance[];
}

export interface TimeBreakdownComponent {
  component_id: string;
  name: string;
  time: number;
}

export interface ImprovementBreakdownComponent {
  component_id: string;
  name: string;
  score_segments: number[];
}

export interface DBDatePeformance {
  date: number;
  score: number | null;
  improvement_rate: number;
  total_duration: number;
  time_breakdown: number[];
  time_breakdown_components: {
    activities: TimeBreakdownComponent[];
    skills: TimeBreakdownComponent[];
  };
  improvement_breakdown_components: {
    activities: ImprovementBreakdownComponent[];
    skills: ImprovementBreakdownComponent[];
  };
  activity: (Target | Result)[];
}

export interface AvailableActivity {
  id: string;
  name: string;
  short_name: string;
}

export type AvailableSkill = Omit<AvailableActivity, 'short_name'>;

export interface DatePeformance {
  date: Date;
  score: number | null;
  improvement_rate: number | null;
  total_duration: number | null;
  time_breakdown: number[];
  time_breakdown_components: {
    activities: TimeBreakdownComponent[];
    skills: TimeBreakdownComponent[];
  };
  improvement_breakdown_components: {
    activities: ImprovementBreakdownComponent[];
    skills: ImprovementBreakdownComponent[];
  };
  activity: (Target | Result)[];
}

export interface DBTarget {
  activity_type: 'target';
  id: string;
  name: string;
  target_type: 'activity' | 'skill';
  type: 'time' | 'score' | 'improvement';
  status: 'set' | 'achieved' | 'missed' | 'future-expire';
  figure: number;
  time: number;
  start_time: number;
  end_time: number;
  achieve_time?: number;
}

export interface Target {
  activity_type: 'target';
  id: string;
  name: string;
  target_type: 'activity' | 'skill';
  type: 'time' | 'score' | 'improvement';
  status: 'set' | 'achieved' | 'missed' | 'future-expire';
  figure: number;
  time: Date;
  start_time: Date;
  end_time: Date;
  achieve_time?: Date;
}

export interface DBResult {
  activity_type: 'result';
  id: string;
  name: string;
  short_name: string;
  hyperlink: string;
  image: string;
  score: number;
  mode: 'normal' | 'training';
  from: number;
  to: number;
  duration: number;
  high_score: boolean;
  stanine: 'below' | 'average' | 'above';
}

export interface Result {
  activity_type: 'result';
  id: string;
  name: string;
  short_name: string;
  hyperlink: string;
  image: string;
  score: number;
  mode: 'normal' | 'training';
  from: Date;
  to: Date;
  duration: number;
  high_score: boolean;
  stanine: 'below' | 'average' | 'above';
}
