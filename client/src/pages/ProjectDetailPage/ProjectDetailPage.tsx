import type { FC } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetInteractionsQuery, useGetProjectByIdQuery } from "../../features/projects/projectsApi";
import StageBadge from "../../components/StageBadge";
import InteractionForm from "../../components/InteractionForm";
import InteractionList from "../../components/InteractionList";
import { useTranslation } from "../../hooks/useTranslation";
import styles from "./ProjectDetailPage.module.css";

const ProjectDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, isError } = useGetProjectByIdQuery(id ?? "", { skip: !id });
  const { data: interactions } = useGetInteractionsQuery(id ?? "", { skip: !id });
  const { t, language } = useTranslation();

  if (isLoading) return <p>{t.loadingProject}</p>;
  if (isError || !project) return <p className={styles.error}>{t.projectNotFound}</p>;

  const client = project.clientId;
  const backArrow = language === "he" ? "→" : "←";

  return (
    <div>
      <Link to="/" className={styles.back}>
        {backArrow} {t.backToProjects}
      </Link>

      <div className={styles.header}>
        <h2>{project.title}</h2>
        <StageBadge stage={project.stage} />
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
