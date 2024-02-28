export type TemplateType =
  | 'horizontal-images'
  | 'horizontal-letters'
  | 'horizontal-text'
  | 'vertical-text';

export interface Exam {
  id: string;
  name: string;
  question_quantity: number;
  show_results: boolean;
  template_type: TemplateType;
  allow_copilot: boolean;
  customization_mode: boolean;
  training_mode: boolean;
  flag_questions: boolean;
  exam_builder: boolean;
  random_answer_order: boolean;
  hide_question_body_preview: boolean;
  duration: number;
  question_duration: number;
  allow_user_navigation: boolean;
  strong_pass: number | null;
  weak_pass: number | null;
  question_map: boolean;
  categories: Category[];
  custom_content?: {
    id: string;
    type: ExamCustomContentType;
    content: any;
  };
  max_questions: number | null;
  min_questions: number | null;
}

export type ExamCustomContentType = 'text' | 'image' | 'tabs';

export interface Category {
  id: string;
  name: string;
  sub_categories: Category[];
  questions: Question[];
}

export interface Question {
  id: string;
  body: string;
  answers: Answer[];
  informations: QuestionInformation[];
  explanation: string;
  featured_image?: string;
}

export interface Answer {
  id: string;
  body: string;
  is_right: boolean;
}

export interface QuestionInformation {
  id: string;
  type: 'hyperlink' | 'image' | 'pdf';
  name: string;
  hyperlink: string;
}

// export interface SkillCategory {
//   id: string;
//   name: string;
// }
