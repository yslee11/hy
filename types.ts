export enum Gender {
  MALE = '남성',
  FEMALE = '여성'
}

export enum AgeGroup {
  TEEN = '10대',
  TWENTY = '20대',
  THIRTY = '30대',
  FORTY = '40대',
  FIFTY = '50대',
  SIXTY_PLUS = '60대 이상'
}

export enum Job {
  STUDENT = '학생',
  OFFICE = '사무직',
  FIELD = '현장직',
  SELF_EMPLOYED = '자영업',
  UNEMPLOYED = '무직',
  OTHER = '기타'
}

export interface Demographics {
  gender: Gender | '';
  age: AgeGroup | '';
  job: Job | '';
}

// 1-5 Likert scale
export type LikertValue = 1 | 2 | 3 | 4 | 5;

export interface SurveyResponse {
  imageId: string;
  aesthetics: LikertValue | null; // 심미성
  stability: LikertValue | null;  // 안정성
  identity: LikertValue | null;   // 정체성
  depression: LikertValue | null; // 우울함
  boredom: LikertValue | null;    // 지루함
}

export interface AppState {
  step: 'START' | 'SURVEY' | 'FINISH';
  demographics: Demographics;
  assignedGroup: number | null; // 1 to 50
  images: string[]; // List of Image IDs for the current user
  currentImageIndex: number;
  responses: SurveyResponse[];
  isSubmitting: boolean;
}

export const QUESTIONS = [
  { key: 'aesthetics', label: '심미성 (아름다움)' },
  { key: 'stability', label: '안정성 (편안함)' },
  { key: 'identity', label: '정체성 (특색있음)' },
  { key: 'depression', label: '우울함' },
  { key: 'boredom', label: '지루함' },
] as const;