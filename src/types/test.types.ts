export interface Test {
  id: string;
  name: string;
  subject?: string;
  topics?: string[];
  sub_topics?: string[];
  status?: string;
  created_at?: string;
  type?: string;
  difficulty?: string;
  correct_marks?: number;
  wrong_marks?: number;
  unattempt_marks?: number;
  total_time?: number;
  total_marks?: number;
  total_questions?: number;
  questions?: string[];
  [key: string]: unknown;
}

export interface TestsResponse { success: boolean; data: Test[]; message?: string; }
export interface TestResponse {
  status: "success" | "error";
  data: Test;
  message?: string;
}

export interface CreateTestPayload {
  name: string;
  type: string;
  subject: string;
  topics: string[];
  sub_topics: string[];
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  difficulty: string;
  total_time: number;
  total_marks: number;
  total_questions: number;
  status?: "live" | "unpublished" | "scheduled" | "expired" | "draft";
}

export interface UpdateTestPayload {
  name?: string;
  questions?: string[];
  total_questions?: number;
  total_marks?: number;
  status?: string;
}
