export const PROJECT_STAGES = [
  "inquiry",
  "consultation",
  "quote",
  "contract",
  "preliminary_design",
  "permits",
  "detailed_design",
  "construction_oversight",
  "handover",
] as const;

export type ProjectStage = (typeof PROJECT_STAGES)[number];

export interface ClientContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

export interface Client {
  _id: string;
  name: string;
  contactInfo?: ClientContactInfo;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  title: string;
  clientId: Client;
  stage: ProjectStage;
  createdAt: string;
  updatedAt: string;
  daysSinceLastInteraction?: number;
  needsAttention?: boolean;
}

export interface Interaction {
  _id: string;
  projectId: string;
  date: string;
  rawText: string;
  summary: string;
  summarizedByAi: boolean;
  suggestedFollowUp?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  _id: string;
  name: string;
  role: string;
  projectId: string;
  contactInfo?: ClientContactInfo;
  createdAt: string;
  updatedAt: string;
}
