import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Language } from "../../i18n/translations";

const STORAGE_KEY = "architect-crm-language";

function getInitialLanguage(): Language {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "en" ? "en" : "he";
}

interface LanguageState {
  language: Language;
}

const initialState: LanguageState = { language: getInitialLanguage() };

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      window.localStorage.setItem(STORAGE_KEY, action.payload);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
