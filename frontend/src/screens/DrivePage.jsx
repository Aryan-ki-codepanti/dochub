import React, { useState } from "react";
import { Col, Container, Nav, Row, Tab } from "react-bootstrap";
import { FaRegSmile, FaFile, FaShareAlt, FaUpload } from "react-icons/fa";

import FileUploader from "../components/FileUploader";
import { useGetFilesInfoMutation } from "../slices/filesApiSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import FileInfoItem from "../components/FileInfoItem";
import Loader from "../components/Loader";

const DrivePage = () => {
    const [activeTab, setActiveTab] = useState("my-files");

    // my files
    const [myFilesInfo, setMyFilesInfo] = useState([]);
    const [currentMyFileInfo, setCurrentMyFileInfo] = useState(null);
    const [loadingFileInfo, setLoadingFileInfo] = useState(false);
    const [getFilesInfoAPI] = useGetFilesInfoMutation();

    const fetchMyFiles = async () => {
        setLoadingFileInfo(true);
        try {
            const data = await getFilesInfoAPI().unwrap();
            console.log("my files", data);
            setMyFilesInfo(prev => data);
        } catch (error) {
            console.log("fetchMyFiles error", error);
            toast.error("Unable to fetch your files");
        } finally {
            setLoadingFileInfo(false);
        }
    };

    useEffect(() => {
        fetchMyFiles();
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
                                    <h4>Shared Files</h4>
                                    <p>
                                        Files shared with you will appear here.
                                    </p>
                                </Tab.Pane>
                                <Tab.Pane
                                    eventKey="upload-file"
                                    className="text-center py-4"
                                >
                                    <h2>Upload File</h2>
                                    <hr className="border-secondary" />

                                    <p>You can upload your files here.</p>
                                    <FileUploader
                                        setMyFilesInfo={setMyFilesInfo}
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
