export type Answer = {
  id: string | number;
  best_answer: boolean;
}

export interface EnvironmentVariables {
  VITE_BASE_URL: string;
}

export type Question = {
  id: string | number;
  title: string;
  slug: string;
  score: number;
  answers?: Answer[]
  answerCount: number;
  viewCount: number;
  user?: User
  created_at: string;
  tags?: string[]
}

export type QuestionsData = {
  data: Question[];
  meta: PaginationMeta;
}

export type User = {
	id: string | number;
  name: string;
  image: string;
}

export type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
}

export type PaginationMeta = {
  current_page: number;
  from: number;
  last_page: number;
  links?: PaginationLink[];
  per_page: number;
  to: number;
  total: number;
}

