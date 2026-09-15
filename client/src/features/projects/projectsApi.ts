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
    createProject: builder.mutation<Project, { title: string; clientId: string; stage: ProjectStage }>({
      query: (body) => ({
        url: "/projects",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiSuccessEnvelope<Project>) => response.data,
      invalidatesTags: [{ type: "Project", id: "LIST" }],
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
    createInteraction: builder.mutation<
      Interaction,
      { projectId: string; rawText: string; useAi: boolean }
    >({
      query: ({ projectId, rawText, useAi }) => ({
        url: `/projects/${projectId}/interactions`,
        method: "POST",
        body: { rawText, useAi },
      }),
      transformResponse: (response: ApiSuccessEnvelope<Interaction>) => response.data,
      invalidatesTags: (_result, _error, { projectId }) => [{ type: "Interaction", id: projectId }],
    }),
    deleteInteraction: builder.mutation<void, { projectId: string; interactionId: string }>({
      query: ({ projectId, interactionId }) => ({
        url: `/projects/${projectId}/interactions/${interactionId}`,
        method: "DELETE",
      }),
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
  useCreateProjectMutation,
  useUpdateProjectStageMutation,
  useGetInteractionsQuery,
  useCreateInteractionMutation,
  useDeleteInteractionMutation,
  useGetContactsQuery,
} = projectsApi;
