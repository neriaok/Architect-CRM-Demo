import type { FC } from "react";
import { useState } from "react";
import { useCreateInteractionMutation } from "../../features/projects/projectsApi";
import { useTranslation } from "../../hooks/useTranslation";
import styles from "./InteractionForm.module.css";

interface InteractionFormProps {
  projectId: string;
}

const InteractionForm: FC<InteractionFormProps> = ({ projectId }) => {
  const [rawText, setRawText] = useState("");
  const [pendingMode, setPendingMode] = useState<"ai" | "plain" | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createInteraction, { isLoading }] = useCreateInteractionMutation();
  const { t } = useTranslation();

  const handleSubmit = async (useAi: boolean) => {
    if (!rawText.trim() || isLoading) return;

    setSubmitError(null);
    setPendingMode(useAi ? "ai" : "plain");
    try {
      await createInteraction({ projectId, rawText, useAi }).unwrap();
      setRawText("");
    } catch (err) {
      const status = typeof err === "object" && err !== null ? (err as { status?: unknown }).status : undefined;
      setSubmitError(status === 502 ? t.aiServiceUnavailable : t.interactionSubmitError);
    } finally {
      setPendingMode(null);
    }
  };

  return (
    <div className={styles.form}>
      <textarea
        className={styles.textarea}
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        placeholder={t.interactionFormPlaceholder}
        rows={4}
      />
      <div className={styles.footer}>
        {submitError && <span className={styles.error}>{submitError}</span>}
        {pendingMode === "ai" && <span className={styles.hint}>{t.aiEditHint}</span>}
        <button
          type="button"
          className={styles.saveButton}
          disabled={!rawText.trim() || isLoading}
          onClick={() => handleSubmit(false)}
        >
          {pendingMode === "plain" && <span className={styles.spinner} aria-hidden="true" />}
          {pendingMode === "plain" ? t.interactionSaving : t.saveAsWrittenButton}
        </button>
        <button
          type="button"
          className={styles.aiButton}
          disabled={!rawText.trim() || isLoading}
          onClick={() => handleSubmit(true)}
        >
          {pendingMode === "ai" && <span className={styles.spinner} aria-hidden="true" />}
          {pendingMode === "ai" ? t.interactionSubmitting : t.aiEditButton}
        </button>
      </div>
    </div>
  );
};

export default InteractionForm;
