import api from "./axios";
import type {
  CreateTestPayload,
  TestResponse,
  TestsResponse,
  UpdateTestPayload,
} from "../types/test.types";

export async function getTests(): Promise<TestsResponse> {
  const response = await api.get<TestsResponse>("/tests");
  return response.data;
}

export async function getTestById(id: string): Promise<TestResponse> {
  const response = await api.get<TestResponse>(`/tests/${id}`);
  return response.data;
}

export async function createTest(payload: CreateTestPayload): Promise<TestResponse> {
  const response = await api.post<TestResponse>("/tests", payload);
  return response.data;
}

export async function updateTest(id: string, payload: UpdateTestPayload): Promise<TestResponse> {
  const response = await api.put<TestResponse>(`/tests/${id}`, payload);
  return response.data;
}

export async function publishTest(id: string): Promise<TestResponse> {
  const response = await api.put<TestResponse>(`/tests/${id}`, { status: "live" });
  return response.data;
}
