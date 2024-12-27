import React, { useState } from "react";
import { Col, Container, Nav, Row, Tab } from "react-bootstrap";
import { FaRegSmile, FaFile, FaShareAlt, FaUpload } from "react-icons/fa";

import FileUploader from "../components/FileUploader";
import { useGetFilesInfoMutation } from "../slices/filesApiSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";

const DrivePage = () => {
    const [activeTab, setActiveTab] = useState("my-files");

    // my files
    const [myFilesInfo, setMyFilesInfo] = useState([]);
    const [getFilesInfoAPI] = useGetFilesInfoMutation();

    const fetchMyFiles = async () => {
        try {
            const data = await getFilesInfoAPI().unwrap();
            console.log("my files", data);
            setMyFilesInfo(prev => data);
        } catch (error) {
            console.log("fetchMyFiles error", error);
            toast.error("Unable to fetch your files");
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
            <Container className="pt-5">
                <Tab.Container
                    id="drive-tabs"
                    activeKey={activeTab}
                    onSelect={tabKey => setActiveTab(tabKey)}
                >
                    <Row>
                        <Col
                            sm={3}
                            className="p-3  rounded-2"
                            style={{ background: "#e8e8e8", minHeight: "90vh" }}
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
                                    className="text-center py-4"
                                    style={
                                        myFilesInfo.length > 1
                                            ? {}
                                            : {
                                                  //   minHeight: "90vh",
                                                  background: "#e8e8e8"
                                              }
                                    }
                                >
                                    {myFilesInfo.length > 0 ? (
                                        <p className="mt-4 fs-3 mb-0 d-flex align-items-center justify-content-center gap-3">
                                            Your personal files will be
                                            displayed here.{" "}
                                            <FaRegSmile size={30} />
                                        </p>
                                    ) : (
                                        <>
                                            <h1>myFiles</h1>
                                        </>
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
                                    <FileUploader />
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
