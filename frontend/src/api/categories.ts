import { apiFetch } from "./client";

export async function getCategories(): Promise<Record<string, string>> {
  const response = await apiFetch<Record<string, string>>("/categories");
  return response;
}