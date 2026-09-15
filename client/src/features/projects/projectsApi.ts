import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Project } from "../../types";

interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
}

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Project"],
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
  }),
});

export const { useGetProjectsQuery, useGetProjectByIdQuery } = projectsApi;
