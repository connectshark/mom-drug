export type MainCategory = '藥品主題' | '衛生局政令宣導';

export type SubCategory = 
  | '藥品類'
  | '心理健康'
  | '長照'
  | '食安'
  | '疾病防治'
  | '健康促進'
  | '其他';

export interface Question {
  id: number;
  sectionId: number; // Original序號 in the document
  mainCategory: MainCategory;
  subCategory: SubCategory;
  question: string;
  options: [string, string, string, string];
  answer: number; // 1, 2, 3, or 4
  explanation?: string;
}

export interface QuizConfig {
  mainCategoryFilter: 'ALL' | MainCategory;
  subCategoryFilter: 'ALL' | SubCategory;
  questionCount: number; // default 5
  showInstantAnswer: boolean; // default false (exam mode) or true
}

export interface UserAnswer {
  question: Question;
  selectedOption: number | null; // 1, 2, 3, 4
  isCorrect: boolean;
  timeSpentSeconds: number;
  timedOut?: boolean;
}

export interface QuizResult {
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  timedOutCount?: number;
  score: number; // 0 - 100
  totalTimeSpentSeconds: number;
  userAnswers: UserAnswer[];
  completedAt: Date;
}

export type AppMode = 'CONFIG' | 'QUIZ' | 'RESULT' | 'STUDY_BANK';

