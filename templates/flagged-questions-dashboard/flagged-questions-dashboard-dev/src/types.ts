export interface Exam {
  id: string;
  name: string;
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  questions: Question[];
  sub_categories: Category[];
}

export interface Question {
  id: string;
  body: string;
}
