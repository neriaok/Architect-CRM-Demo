import type { FC } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useGetContactsQuery,
  useGetInteractionsQuery,
  useGetProjectByIdQuery,
  useUpdateProjectStageMutation,
} from "../../features/projects/projectsApi";
import InteractionForm from "../../components/InteractionForm";
import InteractionList from "../../components/InteractionList";
import ContactList from "../../components/ContactList";
import { PROJECT_STAGES } from "../../types";
import type { ProjectStage } from "../../types";
import { useTranslation } from "../../hooks/useTranslation";
import styles from "./ProjectDetailPage.module.css";

const ProjectDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, isError } = useGetProjectByIdQuery(id ?? "", { skip: !id });
  const { data: interactions } = useGetInteractionsQuery(id ?? "", { skip: !id });
  const { data: contacts } = useGetContactsQuery(id ?? "", { skip: !id });
  const [updateStage, { isLoading: isUpdatingStage, isError: isStageUpdateError }] =
    useUpdateProjectStageMutation();
  const { t, language } = useTranslation();

  if (isLoading) return <p>{t.loadingProject}</p>;
  if (isError || !project) return <p className={styles.error}>{t.projectNotFound}</p>;

  const client = project.clientId;
  const backArrow = language === "he" ? "→" : "←";

  const handleStageChange = (nextStage: ProjectStage) => {
    if (!id || nextStage === project.stage) return;
    updateStage({ projectId: id, stage: nextStage });
  };

  return (
    <div>
      <Link to="/" className={styles.back}>
        {backArrow} {t.backToProjects}
      </Link>

      <div className={styles.header}>
        <h2>{project.title}</h2>
        <div className={styles.stageControl}>
          <select
            value={project.stage}
            disabled={isUpdatingStage}
            onChange={(e) => handleStageChange(e.target.value as ProjectStage)}
          >
            {PROJECT_STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {t.stageLabels[stage]}
              </option>
            ))}
          </select>
          {isStageUpdateError && <span className={styles.error}>{t.stageUpdateError}</span>}
        </div>
      </div>

      <section className={styles.section}>
        <h3>{t.clientSectionTitle}</h3>
        <p className={styles.clientName}>{client.name}</p>
        {client.contactInfo.email && (
          <p>
            {t.emailLabel}: {client.contactInfo.email}
          </p>
        )}
        {client.contactInfo.phone && (
          <p>
            {t.phoneLabel}: {client.contactInfo.phone}
          </p>
        )}
        {client.contactInfo.address && (
          <p>
            {t.addressLabel}: {client.contactInfo.address}
          </p>
        )}
        {client.notes && (
          <p className={styles.notes}>
            {t.notesLabel}: {client.notes}
          </p>
        )}
      </section>

      <section className={styles.section}>
        <h3>{t.contactsSectionTitle}</h3>
        <ContactList contacts={contacts ?? []} />
      </section>

      <section className={styles.section}>
        <h3>{t.interactionsSectionTitle}</h3>
        <InteractionForm projectId={project._id} />
        <div className={styles.interactionListWrapper}>
          <InteractionList interactions={interactions ?? []} />
        </div>
      </section>
    </div>
  );
};

export default ProjectDetailPage;
