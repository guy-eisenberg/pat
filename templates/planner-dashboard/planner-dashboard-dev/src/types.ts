export interface DBResult {
  id: string;
  name: string;
  short_name: string;
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
  id: string;
  name: string;
  short_name: string;
  image: string;
  score: number;
  mode: 'normal' | 'training';
  from: Date;
  to: Date;
  duration: number;
  high_score: boolean;
  stanine: 'below' | 'average' | 'above';
}

export interface DBTarget {
  target_id: string;
  target_type: 'activity' | 'skill';
  name: string;
  type: 'time' | 'score' | 'improvement';
  status: 'set' | 'achieved' | 'missed' | 'future-expire';
  figure: number;
  time: number;
  start_time: number;
  end_time: number;
  achieve_time?: number;
}

export interface Target {
  target_id: string;
  target_type: 'activity' | 'skill';
  name: string;
  type: 'time' | 'score' | 'improvement';
  status: 'set' | 'achieved' | 'missed' | 'future-expire';
  figure: number;
  time: Date;
  start_time: Date;
  end_time: Date;
  achieve_time?: Date;
}
