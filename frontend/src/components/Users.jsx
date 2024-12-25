import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Form, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
    useGetAllPeopleMutation,
    useUpdateFriendStatusMutation
} from "../slices/friendsApiSlice";
import { setCredentials } from "../slices/authSlice";
import { useAccessChatMutation } from "../slices/chatApiSlice";
import { toast } from "react-toastify";
import Avatar from "./Misc/Avatar";
import maleAvatar from "../assets/male.png";
import femaleAvatar from "../assets/female.png";
import noResultsFound from "../assets/NoResultsFound.avif";
import { useSearchUsersMutation } from "../slices/usersApiSlice";
import { FaSearch } from "react-icons/fa";

const Users = ({ users, peopleFilter }) => {
    const { userInfo } = useSelector(state => state.auth);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    const [updateFriendStatus, { isLoading }] = useUpdateFriendStatusMutation();
    const [getAllPeople, { isLoading2 }] = useGetAllPeopleMutation();
    const [accessChat, { isLoading3 }] = useAccessChatMutation();
    const [searchUsersApi] = useSearchUsersMutation();

    const dispatch = useDispatch();

    const doAction = async (e, user, action) => {
        console.log(user);
        try {
            // action 0 , 1, 2, 3,4
            // cancel(0) / send(1) /accept(2)/reject(3) / unfriend(4)
            const data = await updateFriendStatus({
                id: user._id,
                action
            }).unwrap();

            if (action === 2) {
                // create chat if 2 (accept request)
                const chatData = await accessChat({
                    userId: user._id
                }).unwrap();
                console.log("CHAT data", chatData);
                if (user.name)
                    toast.info(`You and ${user.name} are now friends 😎`);
                else toast.info(`You got a new friend`);
            }
            if (data.status === 200) {
                const data = await getAllPeople().unwrap();
                dispatch(setCredentials({ ...userInfo, people: data.people }));
            }
        } catch (error) {
            console.log("ERROR in DO ACTION");
        }
    };

    const RenderButton2 = ({ user }) => {
        let isFriend = userInfo.friends.find(x => x.user === user._id);
        // console.log("R2", user._id, isFriend);
        console.log(userInfo);
        let stats = null;
        if (isFriend) stats = isFriend.status;

        if (!stats)
            return (
                <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={e => doAction(e, user, 1)}
                >
                    Add Friend
                </Button>
            );
        else if (stats == 1)
            // req sent
            return (
                <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={e => doAction(e, user, 0)}
                >
                    Sent
                </Button>
            );
        else if (stats == 2)
            // received so accept/reject
            return (
                <div className="d-flex gap-2 justify-content-center">
                    <Button
                        variant="outline-success"
                        size="sm"
                        onClick={e => doAction(e, user, 2)}
                    >
                        Accept
                    </Button>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={e => doAction(e, user, 3)}
                    >
                        Reject
                    </Button>
                </div>
            );
        // 3 friends
        else
            return (
                <>
                    {/* calls, messages etc */}
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={e => doAction(e, user, 4)}
                    >
                        Remove Friend
                    </Button>
                </>
            );
    };

    const RenderButton = u1 => {
        let user = { ...u1 };
        if (u1?.user) user = { ...u1.user };

        let me = userInfo._id;
        if (!user?.status)
            return (
                <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={e => doAction(e, user, 1)}
                >
                    Add Friend
                </Button>
            );
        else if (user.status == 1)
            // req sent
            return (
                <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={e => doAction(e, user, 0)}
                >
                    Sent
                </Button>
            );
        else if (user.status == 2)
            // received so accept/reject
            return (
                <div className="d-flex gap-2 justify-content-center">
                    <Button
                        variant="outline-success"
                        size="sm"
                        onClick={e => doAction(e, user, 2)}
                    >
                        Accept
                    </Button>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={e => doAction(e, user, 3)}
                    >
                        Reject
                    </Button>
                </div>
            );
        // 3 friends
        else
            return (
                <>
                    {/* calls, messages etc */}
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={e => doAction(e, user, 4)}
                    >
                        Remove Friend
                    </Button>
                </>
            );
    };

    const handleSearchQuery = async query => {
        setSearchQuery(prev => query);
        if (!query) return;
        try {
            const data = await searchUsersApi(query).unwrap();
            setSearchResults(prev => data);
            console.log("SEARCH PPL", data);
        } catch (error) {
            toast.error("Couldn't fetch results");
            console.log("ERROR in searching users");
            console.log(error);
        }
    };

    useEffect(() => {
        // filter users
        if (peopleFilter === "requests")
            setFilteredUsers(
                prev => users.filter(x => x?.status === 1 || x?.status === 2) // sent and received requests
            );
        else if (peopleFilter === "friends")
            setFilteredUsers(prev => users.filter(x => x?.status === 3));
        // all
        else setFilteredUsers(prev => users);

        console.log("filter", peopleFilter);
    }, [peopleFilter, setFilteredUsers, users]);

    return (
        <div>
            <Row className="g-4 mt-5">
                {peopleFilter === "search" ? (
                    <>
                        <div className="mt-0">
                            <InputGroup className="mb-5 w-25 rounded-5">
                                <Form.Control
                                    type="text"
                                    placeholder="Search People eg. Jane, Mili ..."
                                    onChange={e =>
                                        handleSearchQuery(e.target.value)
                                    }
                                    aria-label="Search"
                                    aria-describedby="search-addon"
                                />

                                <InputGroup.Text id="search-addon">
                                    <FaSearch />
                                </InputGroup.Text>
                            </InputGroup>
                        </div>
                        {searchQuery ? (
                            searchResults.length > 0 ? (
                                searchResults.map(user => (
                                    <Col
                                        key={user._id}
                                        md={6}
                                        lg={4}
                                        className="mb-5"
                                    >
                                        <Card className="h-100 shadow-sm d-flex flex-column align-items-center">
                                            <Avatar
                                                styles={{
                                                    transform:
                                                        "translateY(-40px)",
                                                    marginBottom: "-40px",
                                                    border: "2px solid #eaeaea"
                                                }}
                                                size="lg"
                                                cursor="initial"
                                                src={
                                                    user.pic ||
                                                    (user.gender === "M"
                                                        ? maleAvatar
                                                        : femaleAvatar)
                                                }
                                            />
                                            <Card.Body className="d-flex flex-column text-center">
                                                <Card.Title className="mb-3">
                                                    {user.name}
                                                </Card.Title>
                                                {user.gender && (
                                                    <Card.Subtitle
                                                        className={`mb-3 text-${
                                                            user.gender === "M"
                                                                ? "primary"
                                                                : "danger"
                                                        }`}
                                                    >
                                                        Gender:{" "}
                                                        {user.gender === "M"
                                                            ? "Male"
                                                            : "Female"}
                                                    </Card.Subtitle>
                                                )}
                                                <Card.Text className="text-muted">
                                                    <small>
                                                        Email : {user.email}
                                                    </small>
                                                </Card.Text>
                                                <div className="mt-auto">
                                                    <RenderButton2
                                                        user={user}
                                                    />
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <div
                                    style={{
                                        marginTop: "-20px",
                                        fontFamily: "Work Sans"
                                    }}
                                    className="d-flex flex-column align-items-center"
                                >
                                    <img
                                        style={{
                                            objectFit: "cover",
                                            marginTop: "-30px",
                                            marginBottom: "-30px"
                                        }}
                                        className=""
                                        width={400}
                                        src={noResultsFound}
                                        alt="404-Not-found"
                                    />
                                    <span className="text-info fs-1">
                                        No results found
                                    </span>
                                </div>
                            )
                        ) : (
                            <span
                                className="text-dark fs-5"
                                style={{ marginTop: "-20px" }}
                            >
                                Type to Search People ...
                            </span>
                        )}
                    </>
                ) : (
                    filteredUsers.map(user => (
                        <Col key={user._id} md={6} lg={4} className="mb-5">
                            <Card className="h-100 shadow-sm d-flex flex-column align-items-center">
                                <Avatar
                                    styles={{
                                        transform: "translateY(-40px)",
                                        marginBottom: "-40px",
                                        border: "2px solid #eaeaea"
                                    }}
                                    size="lg"
                                    cursor="initial"
                                    src={
                                        user.pic ||
                                        (user.gender === "M"
                                            ? maleAvatar
                                            : femaleAvatar)
                                    }
                                />
                                <Card.Body className="d-flex flex-column text-center">
                                    <Card.Title className="mb-3">
                                        {user.name}
                                    </Card.Title>
                                    {user.gender && (
                                        <Card.Subtitle
                                            className={`mb-3 text-${
                                                user.gender === "M"
                                                    ? "primary"
                                                    : "danger"
                                            }`}
                                        >
                                            Gender:{" "}
                                            {user.gender === "M"
                                                ? "Male"
                                                : "Female"}
                                        </Card.Subtitle>
                                    )}
                                    <Card.Text className="text-muted">
                                        <small>Email : {user.email}</small>
                                    </Card.Text>
                                    <div className="mt-auto">
                                        <RenderButton user={user} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
        </div>
    );
};

export default Users;
