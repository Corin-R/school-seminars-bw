import { apiFetch } from "./client";

export interface District {
  key: string;
  district: string;
}

export async function getDistricts(): Promise<District[]> {
  const response = await apiFetch<Record<string, District>>("/districts");
  return Object.values(response);
}