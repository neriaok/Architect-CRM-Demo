import type { FC } from "react";
import type { ProjectStage } from "../../types";
import { useTranslation } from "../../hooks/useTranslation";
import styles from "./StageBadge.module.css";

interface StageBadgeProps {
  stage: ProjectStage;
}

const StageBadge: FC<StageBadgeProps> = ({ stage }) => {
  const { t } = useTranslation();
  return <span className={styles.badge}>{t.stageLabels[stage]}</span>;
};

export default StageBadge;
