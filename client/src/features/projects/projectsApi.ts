import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Interaction, Project } from "../../types";

interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
}

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Project", "Interaction"],
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => "/projects",
      transformResponse: (response: ApiSuccessEnvelope<Project[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Project" as const, id: _id })),
              { type: "Project" as const, id: "LIST" },
            ]
          : [{ type: "Project" as const, id: "LIST" }],
    }),
    getProjectById: builder.query<Project, string>({
      query: (id) => `/projects/${id}`,
      transformResponse: (response: ApiSuccessEnvelope<Project>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Project", id }],
    }),
    getInteractions: builder.query<Interaction[], string>({
      query: (projectId) => `/projects/${projectId}/interactions`,
      transformResponse: (response: ApiSuccessEnvelope<Interaction[]>) => response.data,
      providesTags: (_result, _error, projectId) => [{ type: "Interaction", id: projectId }],
    }),
    createInteraction: builder.mutation<Interaction, { projectId: string; rawText: string }>({
      query: ({ projectId, rawText }) => ({
        url: `/projects/${projectId}/interactions`,
        method: "POST",
        body: { rawText },
      }),
      transformResponse: (response: ApiSuccessEnvelope<Interaction>) => response.data,
      invalidatesTags: (_result, _error, { projectId }) => [{ type: "Interaction", id: projectId }],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useGetInteractionsQuery,
  useCreateInteractionMutation,
} = projectsApi;
