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
import Avatar from "../Misc/Avatar";

import maleAvatar from "../../assets/male.png";
import femaleAvatar from "../../assets/female.png";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const FileInfoItem = ({
    file,
    onMouseEnter,
    currentMyFileInfo,
    onMouseLeave,
    handleDownload,
    handleView,
    handleDelete
}) => {
    const imgRegex = /^image\/.+$/;
    function formatDate(date) {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return date.toLocaleDateString("en-US", options);
    }

    return (
        <div
            className={`FileInfoItem border rounded-2 px-4 py-3 bg-light d-flex align-items-center ${
                file.isShared
                    ? "justify-content-between"
                    : "justify-content-end"
            } gap-3 gap-md-5`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div style={file.isShared ? {} : { marginRight: "auto" }}>
                {file.mimetype === "application/pdf" ? (
                    <FaFilePdf fill="#FF0000" size={30} />
                ) : imgRegex.test(file.mimetype) ? (
                    <FaFileImage fill="#4CAF50" size={30} />
                ) : (
                    <FaFileAlt fill="#2196F3" size={30} />
                )}
                <span className="ms-2 fs-6" style={{ fontWeight: "500" }}>
                    {file.isShared
                        ? file.filename.length > 31
                            ? file.filename.substr(0, 30) + "..."
                            : file.filename
                        : file.filename}
                </span>
            </div>
            {currentMyFileInfo === file && (
                <div className="d-flex align-items-center gap-2 gap-md-3 mx-3">
                    <FaBookReader
                        onClick={e =>
                            handleView({
                                fileInfo: file,
                                groupId: file?.groupId?._id
                            })
                        }
                        cursor="pointer"
                        size={20}
                    />
                    <IoDownload
                        onClick={e =>
                            handleDownload({
                                fileInfo: file,
                                groupId: file?.groupId?._id
                            })
                        }
                        cursor="pointer"
                        size={20}
                    />
                    <img
                        onClick={e =>
                            handleDelete({
                                fileInfo: file,
                                groupId: file?.groupId?._id
                            })
                        }
                        width={20}
                        style={{ cursor: "pointer" }}
                        src={binSVG}
                        alt="bin"
                    />
                </div>
            )}
            <div className="d-flex gap-4 position-relative">
                {file.isShared && (
                    <div
                        className="position-absolute"
                        style={{ left: "-70px" }}
                    >
                        <OverlayTrigger
                            placement="bottom"
                            overlay={
                                <Tooltip id={`tooltip-bottom`}>
                                    {file.owner.name}
                                </Tooltip>
                            }
                        >
                            <span
                                className="me-3 "
                                style={{ marginTop: "7px" }}
                            >
                                <Avatar
                                    name={file.owner.name}
                                    size="sm"
                                    src={
                                        file.owner.pic ||
                                        (file.owner.gender === "M"
                                            ? maleAvatar
                                            : femaleAvatar)
                                    }
                                />
                            </span>
                        </OverlayTrigger>
                    </div>
                )}
                <span style={{ textTransform: "uppercase" }}>
                    {file.sizeReadable}
                </span>
                <span>{formatDate(new Date(file.updatedAt))}</span>
            </div>
        </div>
    );
};

export default FileInfoItem;
