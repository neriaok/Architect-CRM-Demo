import { configureStore } from "@reduxjs/toolkit";
import { projectsApi } from "../features/projects/projectsApi";
import languageReducer from "../features/language/languageSlice";

export const store = configureStore({
  reducer: {
    [projectsApi.reducerPath]: projectsApi.reducer,
    language: languageReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(projectsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
