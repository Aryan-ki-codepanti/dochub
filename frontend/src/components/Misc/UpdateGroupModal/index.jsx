import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import ButtonLoad from "react-bootstrap-button-loader";

import { GrView } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import UserBadgeItem from "../UserBatchItem";
import {
    useAddToGroupMutation,
    useRemoveFromGroupMutation,
    useRenameGroupMutation
} from "../../../slices/chatApiSlice";
import { toast } from "react-toastify";
import { setChatInfo } from "../../../slices/authSlice";
import { useSearchFriendsMutation } from "../../../slices/friendsApiSlice";
import UserListItem from "../UserListItem";
import Loader from "../../Loader";

const UpdateGroupChatModal = ({
    fetchAgain,
    setFetchAgain,
    children,
    fetchMessages
}) => {
    const { userInfo, chatInfo } = useSelector(state => state.auth);
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const [renameGroup] = useRenameGroupMutation();
    const [searchFriends] = useSearchFriendsMutation();
    const [addToGroup] = useAddToGroupMutation();
    const [removeFromGroup] = useRemoveFromGroupMutation();
    const dispatch = useDispatch();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(prev => false);
    const handleOpen = () => setShow(prev => true);

    const handleRename = async () => {
        if (!groupChatName) {
            toast.error("Fill new group name");
            return;
        }
        if (groupChatName.length < 5) {
            toast.error("Group name should have atleast 5 letters");
            return;
        }

        try {
            setRenameLoading(prev => true);
            const updatedChat = await renameGroup({
                chatId: chatInfo.selectedChat._id,
                chatName: groupChatName
            }).unwrap();

            toast.success("Group renamed! 👌🏻");

            // update states
            dispatch(setChatInfo({ ...chatInfo, selectedChat: updatedChat }));
            setFetchAgain(!fetchAgain);
            setGroupChatName(prev => "");
        } catch (error) {
            toast.error("Unable to change group name");
            console.log("RENAME Group ERROR", error);
        } finally {
            setRenameLoading(prev => false);
        }
    };

    const handleRemoveUser = async u => {
        // prevent non admins to remove some one else
        if (
            chatInfo.selectedChat.groupAdmin._id !== userInfo._id &&
            userInfo._id !== u._id
        ) {
            toast.error(`Only Admin can remove someone`);
            return;
        }

        // allow people to leave and admins to remove someone else
        try {
            setIsLoading(prev => true);
            const removedChat = await removeFromGroup({
                chatId: chatInfo.selectedChat._id,
                userId: u._id
            }).unwrap();

            //state updates
            if (userInfo._id === u._id) {
                toast.success(`You left the group`);
                dispatch(setChatInfo({ ...chatInfo, selectedChat: null }));
            } else {
                toast.success(`${u.name} removed from the group 🥳`);
                dispatch(
                    setChatInfo({ ...chatInfo, selectedChat: removedChat })
                );
            }
            fetchMessages();
            setFetchAgain(!fetchAgain);
        } catch (error) {
            toast.error(`Unable to remove ${u.name} from group`);
            console.log("Remove USER ERROR", error);
        } finally {
            setIsLoading(prev => false);
        }
    };

    const handleAddUser = async u => {
        if (chatInfo.selectedChat.users.find(x => x._id === u._id)) {
            toast.error(`${u.name} already in the group`);
            return;
        }
        if (chatInfo.selectedChat.groupAdmin._id !== userInfo._id) {
            toast.error(`Only Admin can add to the group`);
            return;
        }
        try {
            setIsLoading(prev => true);
            const addedChat = await addToGroup({
                chatId: chatInfo.selectedChat._id,
                userId: u._id
            }).unwrap();
            toast.success(`${u.name} added to the group 🥳`);

            //state updates
            dispatch(setChatInfo({ ...chatInfo, selectedChat: addedChat }));
            setFetchAgain(!fetchAgain);
        } catch (error) {
            toast.error("Unable to add friend to group");
            console.log("ADD USER ERROR", error);
        } finally {
            setIsLoading(prev => false);
        }
    };

    const handleSearch = async query => {
        setSearch(prev => query);
        if (!query) return;
        try {
            setIsLoading(prev => true);
            const data = await searchFriends(query).unwrap();
            setSearchResult(prev => data);
        } catch (error) {
            toast.error("Couldn't search for friends");
        } finally {
            setIsLoading(prev => false);
        }
    };
    return (
        <>
            {children ? (
                <span onClick={handleOpen}>{children}</span>
            ) : (
                <GrView
                    className="viewIcon rounded"
                    style={{ cursor: "pointer" }}
                    onClick={handleOpen}
                />
            )}
            <Modal className="profile-modal" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title
                        className="d-flex justify-content-center align-items-center w-100"
                        style={{ fontFamily: "Work Sans", fontSize: "35px" }}
                    >
                        {chatInfo.selectedChat.chatName}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* selected */}
                    <div className="w-100 d-flex flex-wrap pb-3">
                        {chatInfo.selectedChat.users
                            .filter(u => u._id != userInfo._id)
                            .map(u => (
                                <UserBadgeItem
                                    user={u}
                                    key={u._id}
                                    handleFunc={e => handleRemoveUser(u)}
                                />
                            ))}
                    </div>

                    <div className="d-flex gap-4 align-items-center mb-3">
                        <Form.Control
                            type="text"
                            placeholder="New Chat Name"
                            value={groupChatName}
                            onChange={e =>
                                setGroupChatName(prev => e.target.value)
                            }
                        />
                        <ButtonLoad
                            loading={renameLoading}
                            variant="secondary"
                            className="d-flex justify-content-between"
                            onClick={handleRename}
                        >
                            Update
                        </ButtonLoad>
                    </div>
                    <Form.Control
                        type="text"
                        placeholder="Add friend to  group"
                        className="mb-3"
                        value={search}
                        onChange={e => handleSearch(e.target.value)}
                    />

                    {/* searched */}
                    {/* searched */}
                    {isLoading ? (
                        <Loader />
                    ) : (
                        searchResult
                            ?.slice(0, 4)
                            .map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunc={e => handleAddUser(user)}
                                />
                            ))
                    )}
                </Modal.Body>
                <Modal.Footer className="mt-3">
                    <Button
                        variant="danger"
                        onClick={e => handleRemoveUser(userInfo)}
                    >
                        Leave Group
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default UpdateGroupChatModal;
