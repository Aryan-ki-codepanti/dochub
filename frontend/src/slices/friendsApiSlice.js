import { apiSlice } from "./apiSlice";
const FRIENDS_URL = "/api/friends";

export const friendApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllPeople: builder.mutation({
            query: () => ({
                url: `${FRIENDS_URL}`,
                method: "GET"
            })
        }),
        updateFriendStatus: builder.mutation({
            query: data => ({
                url: `${FRIENDS_URL}/action`,
                method: "PUT",
                body: data
            })
        }),
        searchFriends: builder.mutation({
            query: q => ({
                url: `${FRIENDS_URL}?search=${q}`,
                method: "GET"
            })
        }),
        getMyFriends: builder.mutation({
            query: () => ({
                url: `${FRIENDS_URL}/my`,
                method: "GET"
            })
        })
    })
});

export const {
    useGetAllPeopleMutation,
    useUpdateFriendStatusMutation,
    useSearchFriendsMutation,
    useGetMyFriendsMutation
} = friendApiSlice;
