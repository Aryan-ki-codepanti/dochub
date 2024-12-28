import React from "react";
import {
    FaBookReader,
    FaFileAlt,
    FaFileImage,
    FaFilePdf
} from "react-icons/fa";
import { IoDownload } from "react-icons/io5";
import binSVG from "../../assets/bin.svg";

import "./FileInfoItem.css";

const FileInfoItem = ({
    file,
    onMouseEnter,
    currentMyFileInfo,
    onMouseLeave,
    handleDownload,
    handleView
}) => {
    const imgRegex = /^image\/.+$/;
    function formatDate(date) {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return date.toLocaleDateString("en-US", options);
    }

    return (
        <div
            className="FileInfoItem border rounded-2 px-4 py-3 bg-light d-flex align-items-center justify-content-end gap-3 gap-md-5"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div style={{ marginRight: "auto" }}>
                {file.mimetype === "application/pdf" ? (
                    <FaFilePdf fill="#FF0000" size={30} />
                ) : imgRegex.test(file.mimetype) ? (
                    <FaFileImage fill="#4CAF50" size={30} />
                ) : (
                    <FaFileAlt fill="#2196F3" size={30} />
                )}
                <span className="ms-2 fs-6" style={{ fontWeight: "500" }}>
                    {file.filename}
                </span>
            </div>
            {currentMyFileInfo === file && (
                <div className="d-flex align-items-center gap-2 gap-md-3 mx-3">
                    <FaBookReader
                        onClick={e => handleView(file)}
                        cursor="pointer"
                        size={20}
                    />
                    <IoDownload
                        onClick={e => handleDownload(file)}
                        cursor="pointer"
                        size={20}
                    />
                    <img
                        width={20}
                        style={{ cursor: "pointer" }}
                        src={binSVG}
                        alt="bin"
                    />
                </div>
            )}
            <div className="d-flex gap-4 ">
                <span style={{ textTransform: "uppercase" }}>
                    {file.sizeReadable}
                </span>
                <span>{formatDate(new Date(file.updatedAt))}</span>
            </div>
        </div>
    );
};

export default FileInfoItem;
