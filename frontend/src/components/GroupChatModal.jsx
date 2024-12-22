import React, { useState } from "react";
import { Button, Form, FormControl, Modal } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useSearchFriendsMutation } from "../slices/friendsApiSlice";
import { useCreateGroupChatMutation } from "../slices/chatApiSlice";
import { toast } from "react-toastify";
import UserListItem from "./Misc/UserListItem";
import UserBadgeItem from "./Misc/UserBatchItem";
import { setChatInfo } from "../slices/authSlice";

const GroupChatModal = () => {
    const [show, setShow] = useState(false);
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { userInfo, chatInfo } = useSelector(state => state.auth);

    const [searchFriends] = useSearchFriendsMutation();
    const [createGroup] = useCreateGroupChatMutation();

    const dispatch = useDispatch();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSearch = async query => {
        setSearch(prev => query);
        if (!query) return;
        try {
            setIsLoading(prev => true);
            const data = await searchFriends(query).unwrap();
            setSearchResult(prev => data);
            setIsLoading(prev => false);
            console.log("SEARCH FRND ", data);
        } catch (error) {
            toast.error("Couldn't search for friends");
        }
    };

    const handleSubmit = async e => {
        if (!groupChatName || !selectedUsers) {
            toast.warning("Please fill all the fields");
            return;
        }
        if (groupChatName.length < 5) {
            toast.warning("Have a group name of atleast 5 letters");
            return;
        }
        if (selectedUsers?.length < 2) {
            toast.warning("You need atleast 2 friends to have a group");
            return;
        }

        try {
            //TODO
            const newGroupChatData = await createGroup({
                name: groupChatName,
                users: selectedUsers
            }).unwrap();

            dispatch(
                setChatInfo({
                    ...chatInfo,
                    chats: [newGroupChatData, ...chatInfo.chats]
                })
            );
            setShow(prev => false);
            toast.success(`Create a group chat ${groupChatName}`);
        } catch (error) {
            console.log("ERROR while creating group", error);
            toast.error("Unable to create group");
        }
    };

    const handleGroup = userToAdd => {
        if (selectedUsers.includes(userToAdd)) {
            toast.warn("Friend already added");
            return;
        }
        setSelectedUsers(prev => [...prev, userToAdd]);
    };
    const handleDelete = u => {
        setSelectedUsers(prev => prev.filter(x => x !== u));
    };

    return (
        <>
            <Button
                className="d-flex align-items-center gap-2"
                variant="dark"
                onClick={handleShow}
            >
                New Group Chat
                <FaPlus />
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title
                        className="d-flex justify-content-center"
                        style={{ fontFamily: "Work Sans", fontSize: "35px" }}
                    >
                        Create Group Chat
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex flex-column align-items-center">
                    <Form.Control
                        type="text"
                        placeholder="Chat Name"
                        className="mb-3"
                        onChange={e => setGroupChatName(prev => e.target.value)}
                    />
                    <Form.Control
                        type="text"
                        placeholder="Search friends"
                        className="mb-1"
                        onChange={e => handleSearch(e.target.value)}
                    />

                    {/* selected */}
                    <div className="w-100 d-flex flex-wrap">
                        {selectedUsers.map(u => (
                            <UserBadgeItem
                                user={u}
                                key={u._id}
                                handleFunc={e => handleDelete(u)}
                            />
                        ))}
                    </div>

                    {/* searched */}
                    {isLoading ? (
                        <span>Loading...</span>
                    ) : (
                        searchResult
                            ?.slice(0, 4)
                            .map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunc={e => handleGroup(user)}
                                />
                            ))
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleSubmit}>
                        Create Chat
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default GroupChatModal;
