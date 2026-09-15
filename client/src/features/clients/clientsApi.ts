import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Client } from "../../types";

interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
}

export const clientsApi = createApi({
  reducerPath: "clientsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    createClient: builder.mutation<Client, { name: string }>({
      query: (body) => ({
        url: "/clients",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiSuccessEnvelope<Client>) => response.data,
    }),
  }),
});

export const { useCreateClientMutation } = clientsApi;
