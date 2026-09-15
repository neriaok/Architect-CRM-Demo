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
