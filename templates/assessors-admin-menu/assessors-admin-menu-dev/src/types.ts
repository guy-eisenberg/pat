export type AssessorType = 'school' | 'airline';

export interface Assessor {
  id: string;
  name: string;
  type: AssessorType;
  assessment: Assessment;
  color: string;
  image?: string;
}

export interface Assessment {
  id: string;
  name: string;
}
