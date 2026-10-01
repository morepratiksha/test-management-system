import api from "./axios";
import type {
  MultiSubTopicsPayload,
  MultiSubTopicsResponse,
  SubjectResponse,
  SubTopicsResponse,
  TopicsResponse,
} from "../types/taxonomy.types";

export async function getSubjects(): Promise<SubjectResponse> {
  const response = await api.get<SubjectResponse>("/subjects");
  return response.data;
}

export async function getTopicsBySubject(subjectId: string): Promise<TopicsResponse> {
  const response = await api.get<TopicsResponse>(`/topics/subject/${subjectId}`);
  return response.data;
}

export async function getSubTopicsByTopic(topicId: string): Promise<SubTopicsResponse> {
  const response = await api.get<SubTopicsResponse>(`/sub-topics/topic/${topicId}`);
  return response.data;
}

export async function getSubTopicsByTopics(payload: MultiSubTopicsPayload): Promise<MultiSubTopicsResponse> {
  const response = await api.post<MultiSubTopicsResponse>("/sub-topics/multi-topics", payload);
  return response.data;
}
