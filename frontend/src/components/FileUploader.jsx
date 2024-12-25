import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaFileUpload, FaFilePdf } from "react-icons/fa";
// import { FaFilePdf } from "react-icons/fa6";

const FileUploader = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    const onDrop = acceptedFiles => {
        // console.log(acceptedFiles);
        const acc = acceptedFiles.map(f => {
            f["preview"] = URL.createObjectURL(f);
            return f;
        });
        console.log("ACC", acc);
        setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
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

            // API REQUEST
            // const response = await axios.post(
            //     "http://your-backend-endpoint/upload",
            //     formData,
            //     {
            //         headers: {
            //             "Content-Type": "multipart/form-data"
            //         }
            //     }
            // );

            toast.success("Files uploaded successfully!");
            // console.log(response.data);
        } catch (error) {
            console.error("Error uploading files:", error);

            toast.error("Failed to upload files.");
        } finally {
            setUploading(false);
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
                    <h4>Selected Files:</h4>
                    <ul className="d-flex flex-column align-items-start">
                        {files.map((file, index) => (
                            <li className="mb-3" key={index}>
                                {file.type === "application/pdf" ? (
                                    <FaFilePdf size={30} />
                                ) : (
                                    <img
                                        src={file["preview"]}
                                        width={30}
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
                        {uploading ? "Uploading..." : "Upload Files"}
                    </Button>
                </div>
            )}
        </Container>
    );
};

export default FileUploader;
