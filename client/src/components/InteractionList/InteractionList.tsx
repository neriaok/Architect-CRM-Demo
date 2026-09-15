import type { FC } from "react";
import type { Interaction } from "../../types";
import { useTranslation } from "../../hooks/useTranslation";
import styles from "./InteractionList.module.css";

interface InteractionListProps {
  interactions: Interaction[];
}

const InteractionList: FC<InteractionListProps> = ({ interactions }) => {
  const { t, language } = useTranslation();

  if (interactions.length === 0) {
    return <p className={styles.empty}>{t.noInteractionsYet}</p>;
  }

  const locale = language === "he" ? "he-IL" : "en-US";

  return (
    <ul className={styles.list}>
      {interactions.map((interaction) => (
        <li key={interaction._id} className={styles.item}>
          <div className={styles.date}>
            {new Date(interaction.date).toLocaleDateString(locale, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
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
  );
};

export default InteractionList;
