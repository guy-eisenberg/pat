export interface TargetData {
  id?: string;
  target: string;
  type: 'time' | 'score' | 'improvement';
  figure: number;
  start_time?: number;
  end_time: number;
}

export interface Target {
  id: string;
  name: string;
  type: 'time' | 'score' | 'improvement';
  target_type: 'activity' | 'skill';
  target_id: string;
  status: 'active' | 'achieved' | 'missed';
  figure: number;
  progress: number;
  start_time: number;
  end_time: number;
  achieve_time?: number;
}
