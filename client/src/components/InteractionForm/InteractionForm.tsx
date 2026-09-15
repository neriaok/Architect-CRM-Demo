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
  const [createInteraction, { isLoading, isError }] = useCreateInteractionMutation();
  const { t } = useTranslation();

  const handleSubmit = async (useAi: boolean) => {
    if (!rawText.trim() || isLoading) return;

    setPendingMode(useAi ? "ai" : "plain");
    try {
      await createInteraction({ projectId, rawText, useAi }).unwrap();
      setRawText("");
    } catch {
      // isError from the hook already surfaces this to the user
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
        {isError && <span className={styles.error}>{t.interactionSubmitError}</span>}
        <button
          type="button"
          className={styles.saveButton}
          disabled={!rawText.trim() || isLoading}
          onClick={() => handleSubmit(false)}
        >
          {pendingMode === "plain" ? t.interactionSaving : t.saveAsWrittenButton}
        </button>
        <button
          type="button"
          className={styles.aiButton}
          disabled={!rawText.trim() || isLoading}
          onClick={() => handleSubmit(true)}
        >
          {pendingMode === "ai" ? t.interactionSubmitting : t.aiEditButton}
        </button>
      </div>
    </div>
  );
};

export default InteractionForm;
