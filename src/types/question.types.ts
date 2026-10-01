export interface QuestionPayload {
  type: "mcq";
  subject: string;
  question: string;

  option1: string;
  option2: string;
  option3: string;
  option4: string;

  correct_option:
    | "option1"
    | "option2"
    | "option3"
    | "option4";

  explanation?: string;
  difficulty?: string;
  test_id: string;
  topic?: string;
  sub_topic?: string;
  media_url?: string;
}

export interface BulkQuestionsPayload {
  questions: QuestionPayload[];
}

export interface Question extends QuestionPayload {
  id: string;
}

export interface BulkQuestionsResponse {
  status: "success" | "error";
  data: Question[];
  message?: string;
}

export interface FetchBulkQuestionsPayload {
  question_ids: string[];
}

export interface FetchBulkQuestionsResponse {
  status: "success" | "error";
  data: Question[];
  message?: string;
}