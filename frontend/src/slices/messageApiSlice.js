import { apiSlice } from "./apiSlice";
const MESSAGE_URL = "/api/message";

export const messageApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        allMessages: builder.mutation({
            query: chatId => ({
                url: `${MESSAGE_URL}/${chatId}`,
                method: "GET"
            })
        }),
        sendMessage: builder.mutation({
            query: data => ({
                url: `${MESSAGE_URL}`,
                method: "POST",
                body: data //   { content, chatId }
            })
        })
    })
});

export const { useAllMessagesMutation, useSendMessageMutation } =
    messageApiSlice;
