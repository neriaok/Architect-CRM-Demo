import type { FC } from "react";
import { useState } from "react";
import type { Interaction } from "../../types";
import { useDeleteInteractionMutation } from "../../features/projects/projectsApi";
import { useTranslation } from "../../hooks/useTranslation";
import ConfirmDialog from "../ConfirmDialog";
import styles from "./InteractionList.module.css";

interface InteractionListProps {
  interactions: Interaction[];
}

const InteractionList: FC<InteractionListProps> = ({ interactions }) => {
  const { t, language } = useTranslation();
  const [deleteInteraction] = useDeleteInteractionMutation();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (interactions.length === 0) {
    return <p className={styles.empty}>{t.noInteractionsYet}</p>;
  }

  const locale = language === "he" ? "he-IL" : "en-US";

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    const interaction = interactions.find((i) => i._id === pendingDeleteId);
    if (!interaction) return;

    setDeleteError(null);
    try {
      await deleteInteraction({
        projectId: interaction.projectId,
        interactionId: interaction._id,
      }).unwrap();
    } catch {
      setDeleteError(t.deleteInteractionError);
    } finally {
      setPendingDeleteId(null);
    }
  };

  return (
    <>
      {deleteError && <p className={styles.deleteError}>{deleteError}</p>}
      <ul className={styles.list}>
        {interactions.map((interaction) => (
          <li key={interaction._id} className={styles.item}>
            <div className={styles.itemHeader}>
              <div className={styles.meta}>
                <span className={styles.date}>
                  {new Date(interaction.date).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                {interaction.summarizedByAi && (
                  <span className={styles.aiBadge}>{t.aiGeneratedBadge}</span>
                )}
              </div>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => setPendingDeleteId(interaction._id)}
              >
                {t.deleteButton}
              </button>
            </div>
            <p className={styles.summary}>{interaction.summary}</p>
            {interaction.suggestedFollowUp && (
              <p className={styles.followUp}>
                <strong>{t.followUpLabel}:</strong> {interaction.suggestedFollowUp}
              </p>
            )}
            <details className={styles.details}>
              <summary>{t.originalTextLabel}</summary>
              <p className={styles.rawText}>{interaction.rawText}</p>
            </details>
          </li>
        ))}
      </ul>

      {pendingDeleteId && (
        <ConfirmDialog
          message={t.deleteInteractionConfirm}
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </>
  );
};

export default InteractionList;
