import { apiSlice } from "./apiSlice";
const FILES_URL = "/api/files";

export const filesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        uploadFiles: builder.mutation({
            query: ({ formData, onUploadProgress }) => ({
                url: `${FILES_URL}/upload`,
                method: "POST",
                body: formData,
                extraOptions: { onUploadProgress }
            })
        })
    })
});

export const { useUploadFilesMutation } = filesApiSlice;
