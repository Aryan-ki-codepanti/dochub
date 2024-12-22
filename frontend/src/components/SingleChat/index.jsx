import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./SingleChat.css";
import { FaArrowLeft } from "react-icons/fa";
import { setChatInfo } from "../../slices/authSlice";
import { getSender } from "../../config/chatLogics";
import ProfileModal from "../Misc/ProfileModal";
import UpdateGroupChatModal from "../Misc/UpdateGroupModal";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { userInfo, chatInfo } = useSelector(state => state.auth); // {chats, selectedChat}
    const dispatch = useDispatch();
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
                        {/* messages */}
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
