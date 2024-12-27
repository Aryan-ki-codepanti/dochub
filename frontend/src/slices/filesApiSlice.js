import { apiSlice } from "./apiSlice";
const FILES_URL = "/api/files";

export const filesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        uploadFiles: builder.mutation({
            query: ({ formData }) => ({
                url: `${FILES_URL}/upload`,
                method: "POST",
                body: formData
            })
        }),
        getFilesInfo: builder.mutation({
            query: () => ({
                url: `${FILES_URL}`,
                method: "GET"
            })
        })
    })
});

export const { useUploadFilesMutation, useGetFilesInfoMutation } =
    filesApiSlice;
