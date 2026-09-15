import type { FC, FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateClientMutation } from "../../features/clients/clientsApi";
import { useCreateProjectMutation } from "../../features/projects/projectsApi";
import { PROJECT_STAGES } from "../../types";
import type { ProjectStage } from "../../types";
import { useTranslation } from "../../hooks/useTranslation";
import styles from "./NewProjectModal.module.css";

interface NewProjectModalProps {
  onClose: () => void;
}

const NewProjectModal: FC<NewProjectModalProps> = ({ onClose }) => {
  const [clientName, setClientName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [stage, setStage] = useState<ProjectStage>(PROJECT_STAGES[0]);
  const [createClient, { isLoading: isCreatingClient }] = useCreateClientMutation();
  const [createProject, { isLoading: isCreatingProject }] = useCreateProjectMutation();
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isSubmitting = isCreatingClient || isCreatingProject;
  const canSubmit = clientName.trim() && projectTitle.trim() && !isSubmitting;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setHasError(false);
    try {
      const client = await createClient({ name: clientName.trim() }).unwrap();
      const project = await createProject({
        title: projectTitle.trim(),
        clientId: client._id,
        stage,
      }).unwrap();
      onClose();
      navigate(`/projects/${project._id}`);
    } catch {
      setHasError(true);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h2>{t.newProjectModalTitle}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.field}>
            {t.clientNameLabel}
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              autoFocus
            />
          </label>
          <label className={styles.field}>
            {t.projectTitleLabel}
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
            />
          </label>
          <label className={styles.field}>
            {t.initialStageLabel}
            <select value={stage} onChange={(e) => setStage(e.target.value as ProjectStage)}>
              {PROJECT_STAGES.map((s) => (
                <option key={s} value={s}>
                  {t.stageLabels[s]}
                </option>
              ))}
            </select>
          </label>

          {hasError && <p className={styles.error}>{t.newProjectError}</p>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              {t.cancelButton}
            </button>
            <button type="submit" className={styles.submitButton} disabled={!canSubmit}>
              {isSubmitting ? t.creatingButton : t.createButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;
