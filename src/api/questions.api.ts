import api from "./axios";
import type {
  BulkQuestionsPayload,
  BulkQuestionsResponse,
  FetchBulkQuestionsPayload,
  FetchBulkQuestionsResponse,
} from "../types/question.types";

export async function createQuestionsBulk(payload: BulkQuestionsPayload): Promise<BulkQuestionsResponse> {
  const response = await api.post<BulkQuestionsResponse>("/questions/bulk", payload);
  return response.data;
}

export async function fetchQuestionsBulk(payload: FetchBulkQuestionsPayload): Promise<FetchBulkQuestionsResponse> {
  const response = await api.post<FetchBulkQuestionsResponse>("/questions/fetchBulk", payload);
  return response.data;
}
