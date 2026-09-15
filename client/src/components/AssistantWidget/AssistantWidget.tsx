import type { FC, FormEvent } from "react";
import { useState } from "react";
import { useAskAssistantMutation } from "../../features/assistant/assistantApi";
import type { AssistantSource } from "../../types";
import { useTranslation } from "../../hooks/useTranslation";
import styles from "./AssistantWidget.module.css";

interface AssistantMessage {
  question: string;
  answer: string;
  source: AssistantSource;
}

const AssistantWidget: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [askAssistant, { isLoading }] = useAskAssistantMutation();
  const { t } = useTranslation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    try {
      const result = await askAssistant({ question: trimmed }).unwrap();
      setMessages((prev) => [...prev, { question: trimmed, answer: result.answer, source: result.source }]);
      setQuestion("");
    } catch {
      setError(t.assistantError);
    }
  };

  return (
    <div className={styles.container}>
      {isOpen && (
        <div className={styles.panel} role="dialog" aria-label={t.assistantTitle}>
          <div className={styles.header}>
            <span>{t.assistantTitle}</span>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label={t.cancelButton}
            >
              ×
            </button>
          </div>

          <div className={styles.messages}>
            {messages.length === 0 && <p className={styles.emptyHint}>{t.assistantEmptyHint}</p>}
            {messages.map((message, index) => (
              <div key={index} className={styles.exchange}>
                <p className={styles.question}>{message.question}</p>
                <p className={styles.answer}>
                  {message.answer}
                  {message.source === "demo" && (
                    <span className={styles.demoBadge}>{t.assistantDemoBadge}</span>
                  )}
                </p>
              </div>
            ))}
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              className={styles.input}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t.assistantPlaceholder}
              disabled={isLoading}
            />
            <button type="submit" className={styles.sendButton} disabled={!question.trim() || isLoading}>
              {isLoading ? t.assistantAsking : t.assistantAskButton}
            </button>
          </form>
        </div>
      )}

      <button type="button" className={styles.toggleButton} onClick={() => setIsOpen((prev) => !prev)}>
        {t.assistantToggleButton}
      </button>
    </div>
  );
};

export default AssistantWidget;
