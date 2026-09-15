import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Contact, Interaction, Project, ProjectStage } from "../../types";

interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
}

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Project", "Interaction", "Contact"],
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
    updateProjectStage: builder.mutation<Project, { projectId: string; stage: ProjectStage }>({
      query: ({ projectId, stage }) => ({
        url: `/projects/${projectId}/stage`,
        method: "PATCH",
        body: { stage },
      }),
      transformResponse: (response: ApiSuccessEnvelope<Project>) => response.data,
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: "Project", id: projectId },
        { type: "Project", id: "LIST" },
      ],
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
    getContacts: builder.query<Contact[], string>({
      query: (projectId) => `/projects/${projectId}/contacts`,
      transformResponse: (response: ApiSuccessEnvelope<Contact[]>) => response.data,
      providesTags: (_result, _error, projectId) => [{ type: "Contact", id: projectId }],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useUpdateProjectStageMutation,
  useGetInteractionsQuery,
  useCreateInteractionMutation,
  useGetContactsQuery,
} = projectsApi;
