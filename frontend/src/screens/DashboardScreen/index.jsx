import React, { useEffect, useState } from "react";
import { FaEnvelope, FaUsers, FaFileAlt } from "react-icons/fa";
import DashboardCard from "../../components/DashboardCard";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

const DashboardScreen = () => {
    const { userInfo, chatInfo } = useSelector(state => state.auth);

    const [friendsCount, setFriendsCount] = useState(0);
    const [messagesCount, setMessagesCount] = useState(0);
    const [filesCount, setFilesCount] = useState(0);

    // TODO
    const fetchData = async () => {
        setFriendsCount(prev =>
            userInfo.friends ? userInfo.friends.length : 0
        );
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Container className="my-5" style={{ fontFamily: "Work Sans" }}>
            <h1>Your Account & Usage Summarised</h1>
            <Row>
                <Col sm={6} md={4} className="py-3">
                    <DashboardCard
                        number={friendsCount}
                        Icon={FaEnvelope}
                        description="Friends"
                    />
                </Col>
                <Col sm={6} md={4} className="py-3">
                    <DashboardCard
                        number="11"
                        Icon={FaEnvelope}
                        description="Messages Sent"
                    />
                </Col>
                <Col sm={6} md={4} className="py-3">
                    <DashboardCard
                        number="24"
                        Icon={FaUsers}
                        description="Active Users"
                    />
                </Col>
                <Col sm={6} md={4} className="py-3">
                    <DashboardCard
                        number="5"
                        Icon={FaFileAlt}
                        description="Reports Generated"
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardScreen;
