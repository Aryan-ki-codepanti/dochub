import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./SingleChat.css";
import { FaArrowLeft } from "react-icons/fa";
import { setChatInfo } from "../../slices/authSlice";
import { getSender } from "../../config/chatLogics";
import ProfileModal from "../Misc/ProfileModal";
import UpdateGroupChatModal from "../Misc/UpdateGroupModal";
import Loader from "../Loader";
import { Form } from "react-bootstrap";
import {
    useAllMessagesMutation,
    useSendMessageMutation
} from "../../slices/messageApiSlice";
import ScrollableChat from "../ScrollableChat";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

import animationGIF from "../../assets/Animation.gif";

const BACKEND_ENDPOINT = import.meta.env.VITE_APP_BACKEND_URL;

let socket = null,
    selectedChatCompare = null;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { userInfo, chatInfo, activeUsers } = useSelector(
        state => state.auth
    ); // {chats, selectedChat}
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");

    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const [sendMessage] = useSendMessageMutation();
    const [allMessages] = useAllMessagesMutation();
    const dispatch = useDispatch();

    // SOCKET IO logic
    useEffect(() => {
        socket =
            import.meta.env.MODE === "development"
                ? io(BACKEND_ENDPOINT)
                : io();
        socket.emit("setup", userInfo);
        socket.on("connected", () => setSocketConnected(prev => true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, []);

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = chatInfo.selectedChat;
    }, [chatInfo.selectedChat]);

    const fetchMessages = async () => {
        if (!chatInfo.selectedChat) return;

        try {
            setLoading(prev => true);
            const fetchedMsgs = await allMessages(
                chatInfo.selectedChat._id
            ).unwrap();
            if (!fetchedMsgs) setMessages(prev => []);
            else setMessages(prev => fetchedMsgs);

            // join room
            socket.emit("join chat", chatInfo.selectedChat._id);
        } catch (error) {
            toast.error("Unable to fetch messages");
            console.log("Fetch Messages error", error);
        } finally {
            setLoading(prev => false);
        }
    };

    const handleSendMessage = async e => {
        if (e.key === "Enter" && newMessage) {
            socket.emit("stop typing", chatInfo.selectedChat._id);
            try {
                setNewMessage(prev => "");
                const sentMessage = await sendMessage({
                    chatId: chatInfo.selectedChat._id,
                    content: newMessage
                }).unwrap();
                // socket io
                socket.emit("new message", sentMessage);

                setMessages([...messages, sentMessage]);
            } catch (error) {
                toast.error("Unable to send message");
            }
        }
    };
    const typingHandler = e => {
        setNewMessage(prev => e.target.value);

        // typing indicator
        if (!socketConnected) return;
        if (!typing) {
            setTyping(true);
            socket.emit("typing", chatInfo.selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;
        setTimeout(() => {
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", chatInfo.selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    useEffect(() => {
        socket.on("message received", newMessageReceived => {
            // notify
            if (
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessageReceived.chat._id
            ) {
                // noitfy
                return;
            }
            setMessages([...messages, newMessageReceived]);
        });
    });

    return (
        <>
            {chatInfo.selectedChat ? (
                <>
                    <div
                        className={`singleChatBox ${
                            activeUsers.includes(
                                getSender(
                                    userInfo._id,
                                    chatInfo.selectedChat.users
                                )._id
                            )
                                ? "online-chat"
                                : ""
                        } d-flex px-2 pb-3 w-100 align-items-center w-100`}
                    >
                        <FaArrowLeft
                            className="arrow-left rounded"
                            size={30}
                            onClick={e =>
                                dispatch(
                                    setChatInfo({
                                        ...chatInfo,
                                        selectedChat: null
                                    })
                                )
                            }
                        />
                        {!chatInfo.selectedChat.isGroupChat ? (
                            <>
                                <div className="d-flex flex-column sender-name">
                                    <span>
                                        {
                                            getSender(
                                                userInfo._id,
                                                chatInfo.selectedChat.users
                                            ).name
                                        }
                                    </span>
                                    {activeUsers.includes(
                                        getSender(
                                            userInfo._id,
                                            chatInfo.selectedChat.users
                                        )._id
                                    ) && (
                                        <span className="text-muted">
                                            <span className="brace">(</span>
                                            online
                                            <span className="brace">)</span>
                                        </span>
                                    )}
                                </div>

                                <ProfileModal
                                    user={getSender(
                                        userInfo._id,
                                        chatInfo.selectedChat.users
                                    )}
                                />
                            </>
                        ) : (
                            <>
                                <span>
                                    {chatInfo.selectedChat.chatName.toUpperCase()}
                                </span>
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>
                        )}
                    </div>
                    <div
                        className="d-flex flex-column justify-content-end p-3 w-100 h-100 rounded overflow-y-hidden"
                        style={{ background: "#e8e8e8" }}
                    >
                        {loading ? (
                            <Loader />
                        ) : (
                            <div className="messages">
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        {isTyping && (
                            <div className="mt-2">
                                <img
                                    src={animationGIF}
                                    width={50}
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                        )}
                        <Form.Control
                            type="text"
                            placeholder="Enter a message ..."
                            className="mt-3"
                            required
                            value={newMessage}
                            onKeyDown={handleSendMessage}
                            onChange={typingHandler}
                        />
                    </div>
                </>
            ) : (
                <div className="d-flex align-items-center justify-content-center h-100">
                    <span
                        className="fs-3 pb-3"
                        style={{ fontFamily: "Work Sans" }}
                    >
                        Click on a user to start chatting
                    </span>
                </div>
            )}
        </>
    );
};

export default SingleChat;
