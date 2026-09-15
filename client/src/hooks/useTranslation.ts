import { useAppSelector } from "./useAppDispatch";
import { TRANSLATIONS } from "../i18n/translations";

export function useTranslation() {
  const language = useAppSelector((state) => state.language.language);
  return { t: TRANSLATIONS[language], language };
}
