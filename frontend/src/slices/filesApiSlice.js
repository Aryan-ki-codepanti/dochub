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
        }),
        downloadFile: builder.mutation({
            query: data => ({
                url: `${FILES_URL}/download`,
                method: "POST",
                body: data,
                responseHandler: response => response.blob()
            })
        }),
        viewFile: builder.mutation({
            query: data => ({
                url: `${FILES_URL}/view`,
                method: "POST",
                body: data,
                responseHandler: response => response.blob()
            })
        }),
        deleteFile: builder.mutation({
            query: data => ({
                url: `${FILES_URL}/delete`,
                method: "POST",
                body: data
            })
        })
    })
});

export const {
    useUploadFilesMutation,
    useGetFilesInfoMutation,
    useDownloadFileMutation,
    useViewFileMutation,
    useDeleteFileMutation
} = filesApiSlice;
