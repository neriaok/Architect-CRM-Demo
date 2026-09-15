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
  const [createInteraction, { isLoading, isError }] = useCreateInteractionMutation();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim() || isLoading) return;

    try {
      await createInteraction({ projectId, rawText }).unwrap();
      setRawText("");
    } catch {
      // isError from the hook already surfaces this to the user
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <textarea
        className={styles.textarea}
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        placeholder={t.interactionFormPlaceholder}
        rows={4}
      />
      <div className={styles.footer}>
        {isError && <span className={styles.error}>{t.interactionSubmitError}</span>}
        <button type="submit" className={styles.submit} disabled={!rawText.trim() || isLoading}>
          {isLoading ? t.interactionSubmitting : t.interactionSubmitButton}
        </button>
      </div>
    </form>
  );
};

export default InteractionForm;
