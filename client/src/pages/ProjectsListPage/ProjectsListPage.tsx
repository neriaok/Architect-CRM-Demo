import { useMemo, useState } from "react";
import type { FC } from "react";
import { Link } from "react-router-dom";
import { useGetProjectsQuery } from "../../features/projects/projectsApi";
import StageBadge from "../../components/StageBadge";
import { PROJECT_STAGES } from "../../types";
import { useTranslation } from "../../hooks/useTranslation";
import styles from "./ProjectsListPage.module.css";

const ProjectsListPage: FC = () => {
  const { data: projects, isLoading, isError } = useGetProjectsQuery();
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  const filteredProjects = useMemo(() => {
    if (!projects) return [];

    const query = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesStage = stageFilter === "all" || project.stage === stageFilter;
      const matchesQuery =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.clientId.name.toLowerCase().includes(query);
      return matchesStage && matchesQuery;
    });
  }, [projects, stageFilter, searchQuery]);

  if (isLoading) return <p>{t.loadingProjects}</p>;
  if (isError) return <p className={styles.error}>{t.failedToLoadProjects}</p>;

  return (
    <div>
      <div className={styles.toolbar}>
        <h2>{t.projectsTitle}</h2>
        <div className={styles.controls}>
          <input
            type="search"
            className={styles.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
          />
          <label className={styles.filter}>
            {t.stageLabel}
            <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}>
              <option value="all">{t.allStages}</option>
              {PROJECT_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {t.stageLabels[stage]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <p className={styles.empty}>{t.noProjectsMatch}</p>
      ) : (
        <div className={styles.grid}>
          {filteredProjects.map((project) => (
            <Link key={project._id} to={`/projects/${project._id}`} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{project.title}</h3>
                <StageBadge stage={project.stage} />
              </div>
              <p className={styles.clientName}>{project.clientId.name}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsListPage;
