import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";

const ChatPage = () => {
    const { userInfo } = useSelector(state => state.auth);
    const [fetchAgain, setFetchAgain] = useState(false);
    return (
        <div style={{ width: "100%" }}>
            <Container
                className="d-flex justify-content-between"
                style={{ height: "91vh", padding: "10px" }}
            >
                {userInfo && <MyChats fetchAgain={fetchAgain} />}
                {userInfo && (
                    <ChatBox
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                    />
                )}
            </Container>
        </div>
    );
};

export default ChatPage;
