import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import FileInfoItem from "../FileInfoItem";

const SharedFileBox = ({
    sharedFilesInfo,
    handleDownload,
    handleView,
    handleDelete,
    downloadLoading,
    viewLoading,
    deleteLoading
}) => {
    const [groupFilter, setGroupFilter] = useState("none");
    const [currentGroupFiles, setCurrentGroupFiles] = useState([]);

    const [selectedGroupFile, setSelectedGroupFile] = useState(null);

    const handleChange = e => {
        const newF = e.target.value;
        setGroupFilter(prev => newF);
        if (newF === "none") {
            setCurrentGroupFiles(prev => []);
            return;
        }

        setCurrentGroupFiles(prev =>
            sharedFilesInfo.find(x => x.groupId === newF)
        );
    };

    useEffect(() => {
        if (groupFilter !== "none")
            setCurrentGroupFiles(prev =>
                sharedFilesInfo.find(x => x.groupId === groupFilter)
            );
    }, [sharedFilesInfo]);

    return (
        <div>
            <h2>Shared Files</h2>

            <div className="d-flex flex-column align-items-start ">
                <h4>Select a group to view its files</h4>
                <Form.Select
                    className="w-50"
                    value={groupFilter}
                    aria-label="save location"
                    onChange={handleChange}
                >
                    <option value="none">Select Group</option>
                    {sharedFilesInfo?.map(grp => (
                        <option key={grp.groupId} value={grp.groupId}>
                            {grp.chatName} (Shared)
                        </option>
                    ))}
                </Form.Select>

                {groupFilter === "none" ? (
                    <>
                        <p className="mt-2 text-danger">
                            Select a group to access shared files
                        </p>
                    </>
                ) : (
                    <div className="mt-5 w-100">
                        <h4>
                            Shared files for group &quot;
                            {currentGroupFiles.chatName}&quot;
                        </h4>

                        <div className="fs-5 fw-semibold px-4 py-3 d-flex align-items-center justify-content-end gap-3">
                            <div
                                style={{
                                    marginRight: "auto"
                                }}
                            >
                                <span>Filename</span>
                            </div>
                            <div className="d-flex gap-4 ">
                                <span>Owner</span>
                                <span>Size</span>
                                <span>Last Modified</span>
                            </div>
                        </div>
                        <div className="d-flex flex-column gap-2">
                            {currentGroupFiles.groupedList.map(f => (
                                <FileInfoItem
                                    key={f._id}
                                    file={f}
                                    currentMyFileInfo={selectedGroupFile}
                                    onMouseEnter={e =>
                                        setSelectedGroupFile(prev => f)
                                    }
                                    onMouseLeave={e =>
                                        setSelectedGroupFile(prev => null)
                                    }
                                    handleDownload={handleDownload}
                                    handleView={handleView}
                                    handleDelete={handleDelete}
                                    downloadLoading={downloadLoading}
                                    viewLoading={viewLoading}
                                    deleteLoading={deleteLoading}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SharedFileBox;
