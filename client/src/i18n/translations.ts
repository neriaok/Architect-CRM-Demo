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
