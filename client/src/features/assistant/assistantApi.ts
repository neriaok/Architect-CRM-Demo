import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { AssistantAnswer } from "../../types";

interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
}

export const assistantApi = createApi({
  reducerPath: "assistantApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    askAssistant: builder.mutation<AssistantAnswer, { question: string }>({
      query: (body) => ({
        url: "/assistant/ask",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiSuccessEnvelope<AssistantAnswer>) => response.data,
    }),
  }),
});

export const { useAskAssistantMutation } = assistantApi;
