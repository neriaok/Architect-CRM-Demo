import type { FC } from "react";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import styles from "./App.module.css";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProjectsListPage from "./pages/ProjectsListPage";
import { useAppDispatch, useAppSelector } from "./hooks/useAppDispatch";
import { setLanguage } from "./features/language/languageSlice";
import type { Language } from "./i18n/translations";

const App: FC = () => {
  const language = useAppSelector((state) => state.language.language);
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const handleLanguageChange = (next: Language) => {
    if (next !== language) {
      dispatch(setLanguage(next));
    }
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Architect CRM</h1>
        <div className={styles.languageSwitch}>
          <button
            type="button"
            className={language === "he" ? styles.languageActive : styles.languageButton}
            onClick={() => handleLanguageChange("he")}
          >
            עברית
          </button>
          <button
            type="button"
            className={language === "en" ? styles.languageActive : styles.languageButton}
            onClick={() => handleLanguageChange("en")}
          >
            English
          </button>
        </div>
      </header>
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<ProjectsListPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
