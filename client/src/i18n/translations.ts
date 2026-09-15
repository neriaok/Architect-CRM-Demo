import type { ProjectStage } from "../types";

export type Language = "he" | "en";

export interface Translations {
  projectsTitle: string;
  stageLabel: string;
  allStages: string;
  noProjectsMatch: string;
  failedToLoadProjects: string;
  loadingProjects: string;
  loadingProject: string;
  projectNotFound: string;
  backToProjects: string;
  clientSectionTitle: string;
  emailLabel: string;
  phoneLabel: string;
  addressLabel: string;
  notesLabel: string;
  interactionsSectionTitle: string;
  interactionFormPlaceholder: string;
  interactionSubmitButton: string;
  interactionSubmitting: string;
  interactionSubmitError: string;
  noInteractionsYet: string;
  followUpLabel: string;
  originalTextLabel: string;
  stageLabels: Record<ProjectStage, string>;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  he: {
    projectsTitle: "פרויקטים",
    stageLabel: "שלב",
    allStages: "כל השלבים",
    noProjectsMatch: "אין פרויקטים התואמים לסינון זה.",
    failedToLoadProjects: "טעינת הפרויקטים נכשלה.",
    loadingProjects: "טוען פרויקטים…",
    loadingProject: "טוען פרויקט…",
    projectNotFound: "הפרויקט לא נמצא.",
    backToProjects: "חזרה לפרויקטים",
    clientSectionTitle: "לקוח",
    emailLabel: "אימייל",
    phoneLabel: "טלפון",
    addressLabel: "כתובת",
    notesLabel: "הערות",
    interactionsSectionTitle: "אינטראקציות",
    interactionFormPlaceholder: "הדביקו כאן סיכום של שיחה או פגישה עם הלקוח...",
    interactionSubmitButton: "סכם ושמור",
    interactionSubmitting: "מסכם…",
    interactionSubmitError: "הסיכום נכשל. נסו שוב.",
    noInteractionsYet: "אין עדיין אינטראקציות.",
    followUpLabel: "משימת המשך מוצעת",
    originalTextLabel: "הטקסט המקורי",
    stageLabels: {
      inquiry: "פנייה ראשונית",
      consultation: "ייעוץ",
      quote: "הצעת מחיר",
      contract: "חוזה",
      preliminary_design: "תכנון ראשוני",
      permits: "היתרים",
      detailed_design: "תכנון מפורט",
      construction_oversight: "פיקוח בנייה",
      handover: "מסירה",
    },
  },
  en: {
    projectsTitle: "Projects",
    stageLabel: "Stage",
    allStages: "All stages",
    noProjectsMatch: "No projects match this filter.",
    failedToLoadProjects: "Failed to load projects.",
    loadingProjects: "Loading projects…",
    loadingProject: "Loading project…",
    projectNotFound: "Project not found.",
    backToProjects: "Back to projects",
    clientSectionTitle: "Client",
    emailLabel: "Email",
    phoneLabel: "Phone",
    addressLabel: "Address",
    notesLabel: "Notes",
    interactionsSectionTitle: "Interactions",
    interactionFormPlaceholder: "Paste a summary of a call or meeting with the client...",
    interactionSubmitButton: "Summarize & Save",
    interactionSubmitting: "Summarizing…",
    interactionSubmitError: "Failed to summarize. Please try again.",
    noInteractionsYet: "No interactions yet.",
    followUpLabel: "Suggested follow-up",
    originalTextLabel: "Original text",
    stageLabels: {
      inquiry: "Inquiry",
      consultation: "Consultation",
      quote: "Quote",
      contract: "Contract",
      preliminary_design: "Preliminary Design",
      permits: "Permits",
      detailed_design: "Detailed Design",
      construction_oversight: "Construction Oversight",
      handover: "Handover",
    },
  },
};
