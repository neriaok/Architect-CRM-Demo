import type { ProjectStage } from "../types";

export type Language = "he" | "en";

export interface Translations {
  projectsTitle: string;
  searchPlaceholder: string;
  stageLabel: string;
  allStages: string;
  needsAttentionBadge: string;
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
  saveAsWrittenButton: string;
  interactionSaving: string;
  aiEditButton: string;
  aiEditHint: string;
  interactionSubmitting: string;
  interactionSubmitError: string;
  aiServiceUnavailable: string;
  noInteractionsYet: string;
  aiGeneratedBadge: string;
  deleteButton: string;
  deleteInteractionConfirm: string;
  deleteConfirmButton: string;
  deleteInteractionError: string;
  followUpLabel: string;
  originalTextLabel: string;
  contactsSectionTitle: string;
  noContactsYet: string;
  stageUpdateError: string;
  newProjectButton: string;
  newProjectModalTitle: string;
  clientNameLabel: string;
  projectTitleLabel: string;
  initialStageLabel: string;
  createButton: string;
  cancelButton: string;
  creatingButton: string;
  newProjectError: string;
  stageLabels: Record<ProjectStage, string>;
  roleLabels: Record<string, string>;
  assistantToggleButton: string;
  assistantTitle: string;
  assistantPlaceholder: string;
  assistantAskButton: string;
  assistantAsking: string;
  assistantEmptyHint: string;
  assistantError: string;
  assistantDemoBadge: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  he: {
    projectsTitle: "פרויקטים",
    searchPlaceholder: "חיפוש לפי שם לקוח או פרויקט...",
    stageLabel: "שלב",
    allStages: "כל השלבים",
    needsAttentionBadge: "דורש תשומת לב",
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
    saveAsWrittenButton: "שמירה כפי שנכתב",
    interactionSaving: "שומר…",
    aiEditButton: "עריכת AI",
    aiEditHint: "זה עשוי לקחת כמה שניות…",
    interactionSubmitting: "מסכם…",
    interactionSubmitError: "הסיכום נכשל. נסו שוב.",
    aiServiceUnavailable: "השירות לא זמין כרגע. אפשר לשמור את הטקסט כפי שנכתב במקום.",
    noInteractionsYet: "אין עדיין אינטראקציות.",
    aiGeneratedBadge: "נוצר ע\"י AI",
    deleteButton: "מחיקה",
    deleteInteractionConfirm: "למחוק את האינטראקציה הזו? לא ניתן לשחזר.",
    deleteConfirmButton: "כן, מחק",
    deleteInteractionError: "המחיקה נכשלה. נסו שוב.",
    followUpLabel: "משימת המשך מוצעת",
    originalTextLabel: "הטקסט המקורי",
    contactsSectionTitle: "אנשי קשר",
    noContactsYet: "אין אנשי קשר רשומים.",
    stageUpdateError: "עדכון השלב נכשל.",
    newProjectButton: "פרויקט חדש",
    newProjectModalTitle: "יצירת פרויקט חדש",
    clientNameLabel: "שם הלקוח",
    projectTitleLabel: "שם הפרויקט",
    initialStageLabel: "שלב התחלתי",
    createButton: "צור",
    cancelButton: "ביטול",
    creatingButton: "יוצר…",
    newProjectError: "יצירת הפרויקט נכשלה. נסו שוב.",
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
    roleLabels: {
      contractor: "קבלן",
      engineer: "מהנדס/ת",
      consultant: "יועץ/ת",
      architect: "אדריכל/ית",
    },
    assistantToggleButton: "שאלו את העוזר",
    assistantTitle: "עוזר AI",
    assistantPlaceholder: 'למשל: "אילו פרויקטים תקועים?"',
    assistantAskButton: "שלח",
    assistantAsking: "חושב…",
    assistantEmptyHint: 'שאלו על הפרויקטים והלקוחות שלכם, למשל "כמה פרויקטים יש בשלב היתרים?".',
    assistantError: "השאלה נכשלה. נסו שוב.",
    assistantDemoBadge: "מצב הדגמה (ה-AI המלא לא זמין כרגע)",
  },
  en: {
    projectsTitle: "Projects",
    searchPlaceholder: "Search by client or project name...",
    stageLabel: "Stage",
    allStages: "All stages",
    needsAttentionBadge: "Needs attention",
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
    saveAsWrittenButton: "Save as written",
    interactionSaving: "Saving…",
    aiEditButton: "AI Edit",
    aiEditHint: "This may take a few seconds…",
    interactionSubmitting: "Summarizing…",
    interactionSubmitError: "Failed to summarize. Please try again.",
    aiServiceUnavailable: "The AI service is currently unavailable. You can save the text as written instead.",
    noInteractionsYet: "No interactions yet.",
    aiGeneratedBadge: "AI-generated",
    deleteButton: "Delete",
    deleteInteractionConfirm: "Delete this interaction? This can't be undone.",
    deleteConfirmButton: "Yes, delete",
    deleteInteractionError: "Failed to delete. Please try again.",
    followUpLabel: "Suggested follow-up",
    originalTextLabel: "Original text",
    contactsSectionTitle: "Contacts",
    noContactsYet: "No contacts yet.",
    stageUpdateError: "Failed to update stage.",
    newProjectButton: "New Project",
    newProjectModalTitle: "New Project",
    clientNameLabel: "Client Name",
    projectTitleLabel: "Project Title",
    initialStageLabel: "Initial Stage",
    createButton: "Create",
    cancelButton: "Cancel",
    creatingButton: "Creating…",
    newProjectError: "Failed to create project. Please try again.",
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
    roleLabels: {
      contractor: "Contractor",
      engineer: "Engineer",
      consultant: "Consultant",
      architect: "Architect",
    },
    assistantToggleButton: "Ask the assistant",
    assistantTitle: "AI Assistant",
    assistantPlaceholder: 'e.g. "Which projects are stuck?"',
    assistantAskButton: "Send",
    assistantAsking: "Thinking…",
    assistantEmptyHint: 'Ask about your projects and clients, e.g. "How many projects are in the permits stage?".',
    assistantError: "The question failed. Please try again.",
    assistantDemoBadge: "Demo mode (full AI is currently unavailable)",
  },
};
