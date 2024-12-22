import { apiSlice } from "./apiSlice";
const CHAT_URL = "/api/chat";

export const chatApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        accessChat: builder.mutation({
            query: data => ({
                url: `${CHAT_URL}`,
                method: "POST",
                body: data
            })
        }),
        fetchChats: builder.mutation({
            query: () => ({
                url: `${CHAT_URL}`,
                method: "GET"
            })
        }),
        createGroupChat: builder.mutation({
            query: data => ({
                url: `${CHAT_URL}/group`,
                method: "POST",
                body: data // {name:'', users:[]}
            })
        }),
        renameGroup: builder.mutation({
            query: data => ({
                url: `${CHAT_URL}/rename`,
                method: "PUT",
                body: data // {chatId , chatName}
            })
        }),
        addToGroup: builder.mutation({
            query: data => ({
                url: `${CHAT_URL}/groupadd`,
                method: "PUT",
                body: data // { chatId, userId }
            })
        }),
        removeFromGroup: builder.mutation({
            query: data => ({
                url: `${CHAT_URL}/groupremove`,
                method: "PUT",
                body: data // { chatId, userId }
            })
        })
    })
});

export const {
    useAccessChatMutation,
    useFetchChatsMutation,
    useCreateGroupChatMutation,
    useRenameGroupMutation,
    useAddToGroupMutation,
    useRemoveFromGroupMutation
} = chatApiSlice;
