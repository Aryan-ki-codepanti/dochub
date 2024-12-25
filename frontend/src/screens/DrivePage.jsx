import React, { useState } from "react";
import { Col, Container, Nav, Row, Tab } from "react-bootstrap";
import { FaFile, FaShareAlt, FaUpload } from "react-icons/fa";
import FileUploader from "../components/FileUploader";

const DrivePage = () => {
    const [activeTab, setActiveTab] = useState("my-files");

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
                                >
                                    <h2>My Files</h2>
                                    <p>
                                        Your personal files will be displayed
                                        here.
                                    </p>
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
