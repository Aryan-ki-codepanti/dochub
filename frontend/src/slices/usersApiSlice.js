import { apiSlice } from "./apiSlice";
const USERS_URL = "/api/users";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: data => ({
                url: `${USERS_URL}/auth`,
                method: "POST",
                body: data
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: "POST"
            })
        }),
        register: builder.mutation({
            query: data => ({
                url: `${USERS_URL}`,
                method: "POST",
                body: data
            })
        }),
        updateUser: builder.mutation({
            query: data => ({
                url: `${USERS_URL}/profile`,
                method: "PUT",
                body: data
            })
        }),
        googleAuthUser: builder.mutation({
            query: data => ({
                url: `${USERS_URL}/auth/google`,
                method: "POST",
                body: data
            })
        }),
        searchUsers: builder.mutation({
            query: query => ({
                url: `${USERS_URL}?search=${query}`,
                method: "GET"
            })
        })
    })
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useUpdateUserMutation,
    useGoogleAuthUserMutation,
    useSearchUsersMutation
} = userApiSlice;
