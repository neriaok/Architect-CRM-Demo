import { Project } from "../models/Project";
import { IClient } from "../models/Client";
import { PROJECT_STAGES, ProjectStage } from "../models/projectStages";
import { computeProjectAttention, getLatestInteractionDates } from "../utils/projectAttention";
import { isHebrewText } from "../utils/language";
import { runClaudeCli } from "./claudeCli";

export interface AssistantAnswer {
  answer: string;
  source: "ai" | "demo";
}

interface ProjectSummary {
  title: string;
  clientName: string;
  stage: ProjectStage;
  daysSinceLastInteraction: number;
  needsAttention: boolean;
}

async function buildContext(): Promise<ProjectSummary[]> {
  const projects = await Project.find().populate<{ clientId: IClient }>("clientId");
  const latestInteractionDates = await getLatestInteractionDates();

  return projects.map((project) => ({
    title: project.title,
    clientName: project.clientId.name,
    stage: project.stage,
    ...computeProjectAttention(project, latestInteractionDates.get(project._id.toString())),
  }));
}

function buildPrompt(question: string, context: ProjectSummary[]): string {
  const rows = context
    .map(
      (p) =>
        `- ${p.title} | client: ${p.clientName} | stage: ${p.stage} | ` +
        `days since last contact: ${p.daysSinceLastInteraction} | needs attention: ${p.needsAttention}`
    )
    .join("\n");

  return (
    "You are an assistant embedded in an architecture firm's CRM. Answer the question " +
    "below using ONLY the project data provided - do not invent details. Be concise " +
    "(2-4 sentences), plain text, no markdown. If the data doesn't answer the question, " +
    "say so plainly. Respond in the same language as the question.\n\n" +
    `PROJECT DATA:\n${rows}\n\n` +
    `QUESTION: ${question}`
  );
}

// Demo-mode fallback: a small keyword matcher over the same real data, used only
// when the claude CLI itself is unavailable (not installed/authenticated on this
// machine) - e.g. a cloud deployment with no local CLI. No LLM call involved.
function answerFromKeywords(question: string, context: ProjectSummary[]): string {
  const q = question.toLowerCase();
  const hebrew = isHebrewText(question);

  const isStuckQuestion = ["תקוע", "תשומת לב", "דורש"].concat(["stuck", "attention", "needs"]).some((k) =>
    q.includes(k)
  );
  if (isStuckQuestion) {
    const stuck = context.filter((p) => p.needsAttention);
    if (stuck.length === 0) {
      return hebrew
        ? "כרגע אין פרויקטים שדורשים תשומת לב מיוחדת."
        : "No projects currently need special attention.";
    }
    const list = stuck.map((p) => `${p.title} (${p.clientName})`).join(", ");
    return hebrew
      ? `נמצאו ${stuck.length} פרויקטים שדורשים תשומת לב: ${list}.`
      : `Found ${stuck.length} project(s) needing attention: ${list}.`;
  }

  const isClientCountQuestion = ["כמה לקוח", "how many client"].some((k) => q.includes(k));
  if (isClientCountQuestion) {
    const uniqueClients = new Set(context.map((p) => p.clientName));
    return hebrew ? `יש ${uniqueClients.size} לקוחות במערכת.` : `There are ${uniqueClients.size} clients in the system.`;
  }

  const isProjectCountQuestion = ["כמה פרויקט", "how many project"].some((k) => q.includes(k));
  if (isProjectCountQuestion) {
    const matchedStage = PROJECT_STAGES.find((stage) => q.includes(stage));
    const matching = matchedStage ? context.filter((p) => p.stage === matchedStage) : context;
    return hebrew
      ? `יש ${matching.length} פרויקטים${matchedStage ? ` בשלב ${matchedStage}` : ""} במערכת.`
      : `There are ${matching.length} projects${matchedStage ? ` in the ${matchedStage} stage` : ""}.`;
  }

  // Word-level match rather than a full-string one: a client name like
  // 'גולן טק בע"מ' should still match a question that just says "גולן טק".
  const questionWords = new Set(q.split(/\s+/).filter((word) => word.length > 1));
  const nameMatchesQuestion = (name: string) =>
    name
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 1)
      .some((word) => questionWords.has(word));

  const matchByName = context.find(
    (p) => nameMatchesQuestion(p.title) || nameMatchesQuestion(p.clientName)
  );
  if (matchByName) {
    return hebrew
      ? `${matchByName.title} (לקוח: ${matchByName.clientName}) נמצא בשלב "${matchByName.stage}", ` +
          `${matchByName.daysSinceLastInteraction} ימים מאז אינטראקציה אחרונה.`
      : `${matchByName.title} (client: ${matchByName.clientName}) is in the "${matchByName.stage}" stage, ` +
          `${matchByName.daysSinceLastInteraction} days since the last interaction.`;
  }

  return hebrew
    ? 'אני יכול לענות על שאלות כמו "אילו פרויקטים תקועים?", "כמה לקוחות יש?", "כמה פרויקטים יש?", או לחפש פרויקט/לקוח לפי שם.'
    : 'I can answer questions like "which projects are stuck?", "how many clients are there?", "how many projects are there?", or look up a project/client by name.';
}

export async function askAssistant(question: string): Promise<AssistantAnswer> {
  const context = await buildContext();

  try {
    const answer = await runClaudeCli(buildPrompt(question, context));
    return { answer, source: "ai" };
  } catch {
    return { answer: answerFromKeywords(question, context), source: "demo" };
  }
}
