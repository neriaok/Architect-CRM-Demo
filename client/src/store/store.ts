import { configureStore } from "@reduxjs/toolkit";
import { projectsApi } from "../features/projects/projectsApi";
import { clientsApi } from "../features/clients/clientsApi";
import languageReducer from "../features/language/languageSlice";

export const store = configureStore({
  reducer: {
    [projectsApi.reducerPath]: projectsApi.reducer,
    [clientsApi.reducerPath]: clientsApi.reducer,
    language: languageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(projectsApi.middleware, clientsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
