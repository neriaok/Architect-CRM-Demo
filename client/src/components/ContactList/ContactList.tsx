import type { FC } from "react";
import type { Contact } from "../../types";
import { useTranslation } from "../../hooks/useTranslation";
import styles from "./ContactList.module.css";

interface ContactListProps {
  contacts: Contact[];
}

const ContactList: FC<ContactListProps> = ({ contacts }) => {
  const { t } = useTranslation();

  if (contacts.length === 0) {
    return <p className={styles.empty}>{t.noContactsYet}</p>;
  }

  return (
    <ul className={styles.list}>
      {contacts.map((contact) => (
        <li key={contact._id} className={styles.item}>
          <span className={styles.name}>{contact.name}</span>
          <span className={styles.role}>{t.roleLabels[contact.role] ?? contact.role}</span>
          {contact.contactInfo?.email && (
            <span className={styles.detail}>{contact.contactInfo.email}</span>
          )}
          {contact.contactInfo?.phone && (
            <span className={styles.detail}>{contact.contactInfo.phone}</span>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ContactList;
