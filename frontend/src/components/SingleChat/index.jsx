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

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { userInfo, chatInfo } = useSelector(state => state.auth); // {chats, selectedChat}
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");

    const [sendMessage] = useSendMessageMutation();
    const [allMessages] = useAllMessagesMutation();
    const dispatch = useDispatch();

    const fetchMessages = async () => {
        if (!chatInfo.selectedChat) return;

        try {
            setLoading(prev => true);
            const fetchedMsgs = await allMessages(
                chatInfo.selectedChat._id
            ).unwrap();
            console.log("fetched msgs", fetchedMsgs);
            if (!fetchedMsgs) setMessages(prev => []);
            else setMessages(prev => fetchedMsgs);
        } catch (error) {
            toast.error("Unable to fetch messages");
            console.log("Fetch Messages error", error);
        } finally {
            setLoading(prev => false);
        }
    };

    const handleSendMessage = async e => {
        if (e.key === "Enter" && newMessage) {
            try {
                setNewMessage(prev => "");
                const sentMessage = await sendMessage({
                    chatId: chatInfo.selectedChat._id,
                    content: newMessage
                }).unwrap();
                console.log("new sent message ", sentMessage);
                setMessages([...messages, sentMessage]);
            } catch (error) {
                toast.error("Unable to send message");
            }
        }
    };
    const typingHandler = e => {
        setNewMessage(prev => e.target.value);

        // typing indicator
    };

    useEffect(() => {
        fetchMessages();
    }, [chatInfo.selectedChat]);

    return (
        <>
            {chatInfo.selectedChat ? (
                <>
                    <div className="singleChatBox d-flex px-2 pb-3 w-100 align-items-center w-100">
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
                                {
                                    getSender(
                                        userInfo._id,
                                        chatInfo.selectedChat.users
                                    ).name
                                }
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
                                />
                            </>
                        )}
                    </div>
                    <div
                        className="d-flex flex-column justify-content-end p-3 w-100 h-100 rounded overflow-y-hidden"
                        style={{ background: "#e8e8e8" }}
                    >
                        {loading ? <Loader /> : <div>{/* messages */}</div>}

                        <Form.Control
                            type="text"
                            placeholder="Enter a message ..."
                            className="mt -3"
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
