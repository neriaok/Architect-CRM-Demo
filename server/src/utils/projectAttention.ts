import { Interaction } from "../models/Interaction";
import { IProject } from "../models/Project";
import { ProjectStage } from "../models/projectStages";

// Rough per-stage tolerance before a lack of contact is worth flagging: early
// sales stages need a fast response, permits/design stages can go quieter
// while work happens elsewhere, and active construction should stay in
// frequent contact.
export const STAGE_ATTENTION_THRESHOLD_DAYS: Record<ProjectStage, number> = {
  inquiry: 3,
  consultation: 7,
  quote: 10,
  contract: 14,
  preliminary_design: 21,
  permits: 30,
  detailed_design: 21,
  construction_oversight: 14,
  handover: 14,
};

export function daysSince(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export function needsAttention(stage: ProjectStage, daysSinceLastInteraction: number): boolean {
  return daysSinceLastInteraction > STAGE_ATTENTION_THRESHOLD_DAYS[stage];
}

export interface ProjectAttention {
  daysSinceLastInteraction: number;
  needsAttention: boolean;
}

// Fetches the most recent Interaction date per project in one query, so callers
// don't need an interaction lookup per project.
export async function getLatestInteractionDates(): Promise<Map<string, Date>> {
  const latest = await Interaction.aggregate<{ _id: string; latestDate: Date }>([
    { $sort: { date: -1 } },
    { $group: { _id: "$projectId", latestDate: { $first: "$date" } } },
  ]);
  return new Map(latest.map((entry) => [entry._id.toString(), entry.latestDate]));
}

export function computeProjectAttention(
  project: Pick<IProject, "stage" | "createdAt">,
  latestInteractionDate: Date | undefined
): ProjectAttention {
  const lastContact = latestInteractionDate ?? project.createdAt;
  const daysSinceLastInteraction = daysSince(lastContact);
  return {
    daysSinceLastInteraction,
    needsAttention: needsAttention(project.stage, daysSinceLastInteraction),
  };
}
