import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Container, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaFileUpload, FaFilePdf } from "react-icons/fa";
import {
    useUploadFilesMutation,
    useUploadToDriveFilesMutation
} from "../slices/filesApiSlice";
import Loader from "./Loader";

const FileUploader = ({ allGroups, fetchMyFiles, fetchGroupDirs }) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    const [uploadFilesApi] = useUploadFilesMutation();
    const [uploadFilesToDriveApi] = useUploadToDriveFilesMutation();

    // save location
    const [saveDirectory, setSaveDirectory] = useState("my");

    const onDrop = acceptedFiles => {
        const acc = acceptedFiles.map(f => {
            f["preview"] = URL.createObjectURL(f);
            return f;
        });
        setFiles(prevFiles => [...prevFiles, ...acc]);
    };

    const onDropRejected = fileRejections => {
        const errors = fileRejections.map(rejection =>
            rejection.errors.map(error => error.message).join(", ")
        );
        const msg = [...new Set(errors)].join(" ; ");
        if (msg) toast.error("Couldn't upload because\n" + msg);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
        maxFiles: 5,
        onDropRejected,
        maxSize: 10 * 1024 * 1024,
        accept: {
            "image/*": [], // Accept all image types
            "application/pdf": [] // Accept PDF files
        }
    });

    const handleUpload = async () => {
        if (files.length === 0) {
            alert("Please add some files before uploading.");
            return;
        }

        const formData = new FormData();
        files.forEach(file => formData.append("files", file)); // Append files to FormData

        try {
            setUploading(true);

            const input =
                saveDirectory === "my"
                    ? { formData }
                    : { formData, groupId: saveDirectory };
            // API REQUEST
            // const resp = await uploadFilesApi(input).unwrap();
            const resp = await uploadFilesToDriveApi(input).unwrap();

            console.log("FILE UPLOAD RESP", resp);

            toast.success("Files uploaded successfully!");

            // refetch
            fetchMyFiles();
            fetchGroupDirs();

            // if (!input.groupId) setMyFilesInfo(prev => [...resp, ...prev]);
            // else setSharedFilesInfo(prev => [...resp, ...prev]);
        } catch (error) {
            console.error("Error uploading files:", error);
            toast.error("Failed to upload files.");
        } finally {
            setUploading(false);
            setFiles(prev => []);
        }
    };
    return (
        <Container className="py-5">
            <div
                {...getRootProps()}
                className={`border border-2 rounded p-5 text-center ${
                    isDragActive
                        ? "bg-light border-primary"
                        : "border-secondary"
                }`}
                style={{
                    cursor: "pointer",
                    transition: "background-color 0.3s, border-color 0.3s",
                    background: isDragActive ? "" : "#e8e8e8"
                }}
            >
                <input {...getInputProps()} />
                <FaFileUpload size={50} className="mb-3" />
                {isDragActive ? (
                    <p className="text-primary fs-5">Drop your files here...</p>
                ) : (
                    <p className="text-secondary fs-5">
                        Drag & drop your files here or click to browse
                    </p>
                )}
            </div>

            <div className="text-center mt-3">
                <Button
                    onClick={() =>
                        document.querySelector("input[type='file']").click()
                    }
                    variant="primary"
                >
                    Browse Files
                </Button>
            </div>

            {files.length > 0 && (
                <div className="mt-5 d-flex flex-column align-items-start">
                    <h4>Select Save Location</h4>
                    <Form.Select
                        value={saveDirectory}
                        aria-label="save location"
                        onChange={e => setSaveDirectory(prev => e.target.value)}
                    >
                        <option value="my">My Files</option>
                        {allGroups?.map(grp => (
                            <option key={grp.groupId} value={grp.groupId}>
                                {grp.chatName} (Shared)
                            </option>
                        ))}
                    </Form.Select>

                    <hr className="border-secondary w-100" />

                    <h4>Selected Files:</h4>
                    <ul className="d-flex flex-column align-items-start">
                        {files.map((file, index) => (
                            <li className="mb-3" key={index}>
                                {file.type === "application/pdf" ? (
                                    <FaFilePdf
                                        fill="#FF0000"
                                        className="me-2"
                                        size={30}
                                    />
                                ) : (
                                    <img
                                        src={file["preview"]}
                                        width={30}
                                        style={{ objectFit: "cover" }}
                                        className="me-2"
                                        alt={file.name}
                                    />
                                )}
                                {file.name} ({(file.size / 1024).toFixed(2)} KB)
                            </li>
                        ))}
                    </ul>

                    <Button
                        onClick={handleUpload}
                        variant="success"
                        disabled={uploading}
                    >
                        {uploading ? (
                            <div className="d-flex gap-2">
                                <Loader size="20px" />
                                Uploading...
                            </div>
                        ) : (
                            "Upload Files"
                        )}
                    </Button>
                </div>
            )}
        </Container>
    );
};

export default FileUploader;
