import { apiSlice } from "./apiSlice";
const FILES_URL = "/api/files";

export const filesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        uploadFiles: builder.mutation({
            query: ({ formData, groupId }) => ({
                url: groupId
                    ? `${FILES_URL}/upload/${groupId}`
                    : `${FILES_URL}/upload`,
                method: "POST",
                body: formData
            })
        }),
        uploadToDriveFiles: builder.mutation({
            query: ({ formData, groupId }) => ({
                url: groupId
                    ? `${FILES_URL}/upload-drive/${groupId}`
                    : `${FILES_URL}/upload-drive`,
                method: "POST",
                body: formData
            })
        }),
        getFilesInfo: builder.mutation({
            query: groupId => ({
                url: groupId ? `${FILES_URL}/${groupId}` : `${FILES_URL}`,
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
        downloadFileFromDrive: builder.mutation({
            query: data => ({
                url: `${FILES_URL}/download-drive`,
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
        viewFileFromDrive: builder.mutation({
            query: data => ({
                url: `${FILES_URL}/view-drive`,
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
        }),
        deleteFileFromDrive: builder.mutation({
            query: data => ({
                url: `${FILES_URL}/delete-drive`,
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
    useDeleteFileMutation,
    useUploadToDriveFilesMutation,
    useDeleteFileFromDriveMutation,
    useDownloadFileFromDriveMutation,
    useViewFileFromDriveMutation
} = filesApiSlice;
