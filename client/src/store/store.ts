import { configureStore } from "@reduxjs/toolkit";
import { projectsApi } from "../features/projects/projectsApi";
import { clientsApi } from "../features/clients/clientsApi";
import { assistantApi } from "../features/assistant/assistantApi";
import languageReducer from "../features/language/languageSlice";

export const store = configureStore({
  reducer: {
    [projectsApi.reducerPath]: projectsApi.reducer,
    [clientsApi.reducerPath]: clientsApi.reducer,
    [assistantApi.reducerPath]: assistantApi.reducer,
    language: languageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(projectsApi.middleware, clientsApi.middleware, assistantApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
