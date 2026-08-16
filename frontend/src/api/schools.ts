import { apiFetch } from "./client";

export interface School {
    district_id: string;
    uuid: string; 
    outpost_number: string;
    name: string;
    city?: string;
    lat: number;
    lng: number;
    official?: number;
    marker_class: string;
    marker_label: string;
    school_id? : string;
    school_kind? : string;
    school_seminar? : string;
}

export async function getSchools(): Promise<School[]> {
  const response = await apiFetch<Record<string, School[]>>("/schools");
  return Object.values(response).flat();
}