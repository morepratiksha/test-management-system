import api from "./axios";
import type { LoginPayload, LoginResponse } from "../types/auth.types";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", payload);
  return response.data;
}
