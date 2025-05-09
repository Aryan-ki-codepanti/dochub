import React, { useState } from "react";
import { Col, Container, Nav, Row, Tab } from "react-bootstrap";
import { FaRegSmile, FaFile, FaShareAlt, FaUpload } from "react-icons/fa";

import FileUploader from "../components/FileUploader";
import {
    useDeleteFileFromDriveMutation,
    useDeleteFileMutation,
    useDownloadFileFromDriveMutation,
    useDownloadFileMutation,
    useGetFilesInfoMutation,
    useViewFileFromDriveMutation,
    useViewFileMutation
} from "../slices/filesApiSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import FileInfoItem from "../components/FileInfoItem";
import Loader from "../components/Loader";
import { useFetchChatsMutation } from "../slices/chatApiSlice";
import { groupByGroupId } from "../config/fileLogics";
import SharedFileBox from "../components/SharedFilesBox";

const DrivePage = () => {
    const [activeTab, setActiveTab] = useState("my-files");

    // my files
    const [myFilesInfo, setMyFilesInfo] = useState([]);
    const [currentMyFileInfo, setCurrentMyFileInfo] = useState(null);
    const [loadingFileInfo, setLoadingFileInfo] = useState(false);
    const [getFilesInfoAPI] = useGetFilesInfoMutation();
    const [downloadFileAPI] = useDownloadFileMutation();
    const [deleteFileAPI] = useDeleteFileMutation();
    const [viewFileAPI] = useViewFileMutation();
    const [fetchChatsAPI] = useFetchChatsMutation();

    // g drive endpts
    const [deleteFileFromDriveAPI] = useDeleteFileFromDriveMutation();
    const [downloadFileFromDriveAPI] = useDownloadFileFromDriveMutation();
    const [viewFileFromDriveAPI] = useViewFileFromDriveMutation();

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [viewLoading, setViewLoading] = useState(false);

    // group directory for upload and shared files
    const [allGroups, setAllGroups] = useState([]);
    const [sharedFilesInfo, setSharedFilesInfo] = useState([]);

    const handleDownload = async data => {
        try {
            // const fileBlob = await downloadFileAPI(data).unwrap();
            setDownloadLoading(prev => true);

            const fileBlob = await downloadFileFromDriveAPI(data).unwrap();
            const url = window.URL.createObjectURL(fileBlob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", data.fileInfo.filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Error downloading file:", error);
            toast.error("Error downloading file");
        } finally {
            setDownloadLoading(prev => false);
        }
    };
    const handleView = async data => {
        try {
            // const fileBlob = await viewFileAPI(data).unwrap();
            setViewLoading(prev => true);

            const fileBlob = await viewFileFromDriveAPI(data).unwrap();
            const url = window.URL.createObjectURL(fileBlob);
            window.open(url, "_blank");
        } catch (error) {
            console.log("Error in viewing file", error);
            toast.error("Error in viewing file");
        } finally {
            setViewLoading(prev => false);
        }
    };

    const handleDelete = async data => {
        try {
            // const resp = await deleteFileAPI(data).unwrap();
            setDeleteLoading(prev => true);
            const resp = await deleteFileFromDriveAPI(data).unwrap();

            if (!resp.success) throw new Error("Error in deleting file");

            toast.success("File Deleted successfully");
            fetchMyFiles();
            fetchGroupDirs();
        } catch (error) {
            toast.error("Error in deleting file");
            console.log("Error in deleting file", error);
        } finally {
            setDeleteLoading(prev => false);
        }
    };

    const fetchMyFiles = async () => {
        setLoadingFileInfo(true);
        try {
            const data = await getFilesInfoAPI().unwrap();
            setMyFilesInfo(prev => data);
        } catch (error) {
            console.log("fetchMyFiles error", error);
            toast.error("Unable to fetch your files");
        } finally {
            setLoadingFileInfo(false);
        }
    };

    const fetchGroupDirs = async () => {
        console.log("refetched");
        try {
            let allChats = await fetchChatsAPI().unwrap();
            allChats = allChats
                .filter(x => x.isGroupChat)
                .map(chat => ({ groupId: chat._id, chatName: chat.chatName }));

            setAllGroups(prev => allChats);
            // get all shared files
            let grpFiles = [];
            for (let grp of allChats) {
                let tmp = await getFilesInfoAPI(grp.groupId).unwrap();
                grpFiles = [...grpFiles, ...tmp];
            }
            grpFiles = groupByGroupId(grpFiles);
            setSharedFilesInfo(prev => grpFiles);
        } catch (error) {
            toast.error("Error in fetching Group Directories");
            console.log("Error in fetchGroupDirs", error);
        }
    };

    useEffect(() => {
        fetchMyFiles();
        fetchGroupDirs();
    }, []);

    return (
        <div
            className="text-dark"
            style={{ minHeight: "100vh", fontFamily: "Work Sans" }}
        >
            <Container className="pt-2">
                <Tab.Container
                    id="drive-tabs"
                    activeKey={activeTab}
                    onSelect={tabKey => setActiveTab(tabKey)}
                >
                    <Row>
                        <Col
                            sm={3}
                            className="p-3  rounded-2"
                            style={{ background: "#e8e8e8", minHeight: "88vh" }}
                        >
                            <Nav
                                variant="pills"
                                className="flex-column"
                                style={{ fontWeight: "bold" }}
                            >
                                <Nav.Item>
                                    <Nav.Link
                                        eventKey="my-files"
                                        className={`${
                                            activeTab === "my-files"
                                                ? "bg-dark text-light"
                                                : "text-dark"
                                        }`}
                                    >
                                        <FaFile className="me-2" />
                                        My Files
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link
                                        eventKey="shared-files"
                                        className={`${
                                            activeTab === "shared-files"
                                                ? "bg-dark text-light"
                                                : "text-dark"
                                        }`}
                                    >
                                        <FaShareAlt className="me-2" />
                                        Shared Files
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link
                                        eventKey="upload-file"
                                        className={`${
                                            activeTab === "upload-file"
                                                ? "bg-dark text-light"
                                                : "text-dark"
                                        }`}
                                    >
                                        <FaUpload className="me-2" />
                                        Upload File
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>

                        <Col sm={9}>
                            <Tab.Content>
                                <Tab.Pane
                                    eventKey="my-files"
                                    className="text-center py-4 rounded-2"
                                >
                                    {loadingFileInfo && <Loader />}
                                    {myFilesInfo.length > 0 ? (
                                        <div>
                                            <h2>My Files</h2>
                                            <div className="fs-5 fw-semibold px-4 py-3 d-flex align-items-center justify-content-end gap-3">
                                                <div
                                                    style={{
                                                        marginRight: "auto"
                                                    }}
                                                >
                                                    <span>Filename</span>
                                                </div>
                                                <div className="d-flex gap-4 ">
                                                    <span>Size</span>
                                                    <span>Last Modified</span>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column gap-2">
                                                {myFilesInfo.map(f => (
                                                    <FileInfoItem
                                                        key={f._id}
                                                        file={f}
                                                        currentMyFileInfo={
                                                            currentMyFileInfo
                                                        }
                                                        onMouseEnter={e =>
                                                            setCurrentMyFileInfo(
                                                                prev => f
                                                            )
                                                        }
                                                        onMouseLeave={e =>
                                                            setCurrentMyFileInfo(
                                                                prev => null
                                                            )
                                                        }
                                                        handleDownload={
                                                            handleDownload
                                                        }
                                                        handleView={handleView}
                                                        handleDelete={
                                                            handleDelete
                                                        }
                                                        downloadLoading={
                                                            downloadLoading
                                                        }
                                                        viewLoading={
                                                            viewLoading
                                                        }
                                                        deleteLoading={
                                                            deleteLoading
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="mt-4 fw-semibold fs-3 mb-0 d-flex align-items-center justify-content-center gap-3">
                                                Your personal files <br /> will
                                                be displayed here.{" "}
                                                <FaRegSmile size={60} />
                                            </p>
                                        </div>
                                    )}
                                </Tab.Pane>
                                <Tab.Pane
                                    eventKey="shared-files"
                                    className="text-center py-4"
                                >
                                    {loadingFileInfo && <Loader />}
                                    {sharedFilesInfo.length > 0 ? (
                                        <SharedFileBox
                                            sharedFilesInfo={sharedFilesInfo}
                                            handleDownload={handleDownload}
                                            handleView={handleView}
                                            handleDelete={handleDelete}
                                            downloadLoading={downloadLoading}
                                            viewLoading={viewLoading}
                                            deleteLoading={deleteLoading}
                                        />
                                    ) : (
                                        <div>
                                            <p className="mt-4 fw-semibold fs-3 mb-0 d-flex align-items-center justify-content-center gap-3">
                                                Your Shared files <br /> will be
                                                displayed here.
                                                <FaRegSmile size={60} />
                                            </p>
                                        </div>
                                    )}
                                </Tab.Pane>
                                <Tab.Pane
                                    eventKey="upload-file"
                                    className="text-center py-4"
                                >
                                    <h2>Upload File</h2>
                                    <hr className="border-secondary" />

                                    <p>You can upload your files here.</p>
                                    <FileUploader
                                        allGroups={allGroups}
                                        fetchMyFiles={fetchMyFiles}
                                        fetchGroupDirs={fetchGroupDirs}
                                    />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Container>
        </div>
    );
};

export default DrivePage;
