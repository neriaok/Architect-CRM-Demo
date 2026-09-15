import type { FC } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import styles from "./ConfirmDialog.module.css";

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({ message, onConfirm, onCancel }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.dialog} role="alertdialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={onCancel}>
            {t.cancelButton}
          </button>
          <button type="button" className={styles.confirmButton} onClick={onConfirm}>
            {t.deleteConfirmButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
