import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFetchChatsMutation } from "../slices/chatApiSlice";
import { setChatInfo } from "../slices/authSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { Button, Container, Modal } from "react-bootstrap";

import { FaPlus } from "react-icons/fa";
import "./MyChats.css";
import { getSender } from "../config/chatLogics";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({ fetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState(null);
    const { userInfo, chatInfo, activeUsers } = useSelector(
        state => state.auth
    );
    const dispatch = useDispatch();
    const [fetchChats, { isLoading }] = useFetchChatsMutation();

    const fetchAllChats = async () => {
        try {
            const allChats = await fetchChats().unwrap();
            dispatch(setChatInfo({ ...chatInfo, chats: allChats }));
        } catch (error) {
            toast.error("Error in fetching all chats");
        }
    };

    useEffect(() => {
        setLoggedUser(userInfo);
        fetchAllChats();
    }, [fetchAgain]);

    return (
        <div
            className="MyChatsBox bg-light"
            style={{
                // todo
                display: chatInfo.selectedChat ? "none" : "flex"
            }}
        >
            <div className="MyChats-header d-flex justify-content-between align-items-center w-100">
                My Chats
                <GroupChatModal />
            </div>
            <div className="chatsContainer d-flex flex-column w-100 h-100 overflow-y-hidden">
                {chatInfo.chats?.length > 0 ? (
                    <div
                        className="d-flex flex-column overflow-y-auto gap-2"
                        style={{ maxHeight: "100vh" }}
                    >
                        {chatInfo.chats.map(chat => (
                            <div
                                key={chat._id}
                                className={`chatContainer-item  position-relative ${
                                    !chat.isGroupChat &&
                                    activeUsers.includes(
                                        getSender(userInfo._id, chat.users)._id
                                    )
                                        ? "border border-2 border-success"
                                        : ""
                                }`}
                                style={
                                    chatInfo.selectedChat === chat
                                        ? {
                                              backgroundColor: "#38B2AC",
                                              color: "white"
                                          }
                                        : {
                                              backgroundColor: "#E8E8E8",
                                              color: "black"
                                          }
                                }
                                onClick={e =>
                                    dispatch(
                                        setChatInfo({
                                            ...chatInfo,
                                            selectedChat: chat
                                        })
                                    )
                                }
                            >
                                <p>
                                    {!chat.isGroupChat
                                        ? getSender(userInfo._id, chat.users)
                                              .name
                                        : chat.chatName}
                                </p>
                                {chat.latestMessage && (
                                    <p style={{ fontSize: ".75rem" }}>
                                        <b>
                                            {chat.latestMessage.sender.name} :{" "}
                                        </b>
                                        {chat.latestMessage.content.length > 50
                                            ? chat.latestMessage.content.substring(
                                                  0,
                                                  51
                                              ) + "..."
                                            : chat.latestMessage.content}
                                    </p>
                                )}

                                {!chat.isGroupChat &&
                                    activeUsers.includes(
                                        getSender(userInfo._id, chat.users)._id
                                    ) && <div className="active-chat" />}
                            </div>
                        ))}
                    </div>
                ) : (
                    <Loader />
                )}
            </div>
        </div>
    );
};

export default MyChats;
