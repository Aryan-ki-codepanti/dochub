import React from "react";
import { useSelector } from "react-redux";
import "./ChatBox.css";
import SingleChat from "../SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const { chatInfo } = useSelector(state => state.auth); // {chats, selectedChat}

    return (
        <div
            style={{ display: chatInfo.selectedChat ? "flex" : "none" }}
            className="chatBox-wrapper flex-column p-3 align-items-center rounded"
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </div>
    );
};

export default ChatBox;
