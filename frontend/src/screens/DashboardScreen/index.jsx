import React, { useEffect, useState } from "react";
import {
    FaEnvelope,
    FaUsers,
    FaFileAlt,
    FaUserFriends,
    FaFileInvoice
} from "react-icons/fa";
import { IoIosChatbubbles, IoMdChatboxes } from "react-icons/io";

import { TiMessages } from "react-icons/ti";

import DashboardCard from "../../components/DashboardCard";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useFetchChatsMutation } from "../../slices/chatApiSlice";
import { useAllMessagesMutation } from "../../slices/messageApiSlice";
import {
    getFavouriteFriend,
    getFavouriteGroup,
    getTotalMessages
} from "../../config/dashboardLogics";
import { toast } from "react-toastify";
import { getSender } from "../../config/chatLogics";
import { useGetFilesInfoMutation } from "../../slices/filesApiSlice";
import { filesize } from "filesize";
import { Line } from "react-chartjs-2";
import LineChart from "../../components/LineChart";

const initialPlotData = {
    labels: ["2024-12-01", "2024-12-02", "2024-12-03"], // Dates
    datasets: [
        {
            label: "Messages Sent",
            data: [5, 10, 7], // Messages corresponding to dates
            fill: false,
            backgroundColor: "#007bff", //"#4bc0c0",
            borderColor: "rgba(75, 192, 192, 0.2)"
        }
    ]
};

const DashboardScreen = () => {
    const { userInfo, chatInfo } = useSelector(state => state.auth);

    const [myChats, setMyChats] = useState([]);
    const [myMessages, setMyMessages] = useState(null);

    const [fetchChats] = useFetchChatsMutation();
    const [allMessages] = useAllMessagesMutation();
    const [getFilesInfoAPI] = useGetFilesInfoMutation();

    const [friendsCount, setFriendsCount] = useState(0);
    const [chatCount, setChatCount] = useState(0);

    const [messagesCount, setMessagesCount] = useState(0);
    const [favouriteGroup, setFavouriteGroup] = useState("NONE");
    const [favouriteGroupMsgCount, setFavouriteGroupMsgCount] = useState(0);

    const [favouriteFriend, setFavouriteFriend] = useState("NONE");
    const [favouriteFriendMsgCount, setFavouriteFriendMsgCount] = useState(0);

    const [myFilesCount, setMyFilesCount] = useState(0);
    const [avgFileSize, setAvgFileSize] = useState(0);
    const [plotData, setPlotData] = useState(initialPlotData);

    const fetchMessagesForChats = async () => {
        let chatIds = myChats.map(x => x._id);
        try {
            const fetchPromises = chatIds.map(chatId =>
                allMessages(chatId)
                    .unwrap()
                    .then(messages => ({
                        chatId,
                        messages
                    }))
            );

            const results = await Promise.all(fetchPromises);
            const transformedMessages = results.reduce(
                (acc, { chatId, messages }) => {
                    acc[chatId] = messages;
                    return acc;
                },
                {}
            );

            console.log("Fetched messages for all chats:", transformedMessages);

            // set Data

            // total messages
            setMessagesCount(prev => getTotalMessages(transformedMessages));

            // favourite group
            const [maxGv, maxGroup] = getFavouriteGroup(
                myChats,
                transformedMessages
            );
            setFavouriteGroup(prev => maxGroup);
            setFavouriteGroupMsgCount(prev => maxGv);

            // favourite friend
            const [maxFv, maxFriend] = getFavouriteFriend(
                myChats,
                transformedMessages
            );
            setFavouriteFriend(prev =>
                maxFriend === "NONE"
                    ? "None"
                    : getSender(userInfo?._id, maxFriend?.users)?.name
            );
            setFavouriteFriendMsgCount(prev => maxFv);
        } catch (err) {
            console.error("Error fetching messages:", err.message);
            toast.error("Error fetching messages");
        }
    };

    const fetchFileData = async () => {
        const data = await getFilesInfoAPI().unwrap();
        console.log("file", data);
        setMyFilesCount(prev => data.length);
        let s = Math.floor(
            data.reduce((acc, f) => acc + f.size, 0) / data.length
        );
        setAvgFileSize(prev => filesize(s));
    };

    const fetchData = async () => {
        setFriendsCount(prev =>
            userInfo.friends ? userInfo.friends.length : 0
        );
        // load iff chats not loaded
        let allChats = [];
        if (!chatInfo.chats?.length) allChats = await fetchChats().unwrap();
        else allChats = chatInfo.chats;
        setChatCount(prev => allChats.length);
        setMyChats(prev => allChats);
    };

    useEffect(() => {
        fetchData();
        fetchFileData();
    }, []);

    useEffect(() => {
        // messages related data
        fetchMessagesForChats();
    }, [myChats]);

    return (
        <Container className="my-5" style={{ fontFamily: "Work Sans" }}>
            <h1>Your Account & Usage Summarised</h1>
            <Row>
                <Col sm={6} md={4} className="py-3">
                    <DashboardCard
                        number={friendsCount}
                        Icon={FaUserFriends}
                        description="Friends"
                    />
                </Col>
                <Col sm={6} md={4} className="py-3">
                    <DashboardCard
                        number={chatCount}
                        Icon={IoMdChatboxes}
                        description="Chats"
                    />
                </Col>
                <Col sm={6} md={4} className="py-3">
                    <DashboardCard
                        number={messagesCount}
                        Icon={FaEnvelope}
                        description="Messages Sent"
                    />
                </Col>
                <Col sm={6} md={4} className="py-3">
                    <DashboardCard
                        number={
                            myChats.length
                                ? Math.floor(messagesCount / myChats.length)
                                : 0
                        }
                        Icon={TiMessages}
                        description="Average Messages Per Chat"
                    />
                </Col>
                <Col sm={6} md={4} className="py-3">
                    <DashboardCard
                        number={favouriteGroupMsgCount}
                        Icon={IoIosChatbubbles}
                        description={
                            favouriteGroupMsgCount
                                ? `Messages sent in Favourite Group "${favouriteGroup}"`
                                : "No Favourite Group"
                        }
                    />
                </Col>
                <Col sm={6} md={4} className="py-3">
                    <DashboardCard
                        number={favouriteFriendMsgCount}
                        Icon={IoIosChatbubbles}
                        description={
                            favouriteFriendMsgCount
                                ? `Messages sent to favourite friend "${favouriteFriend}"`
                                : "No Favourite Friend"
                        }
                    />
                </Col>
                <Col sm={6} md={4} className="py-3">
                    <DashboardCard
                        number={myFilesCount}
                        Icon={FaFileAlt}
                        description="Personal Files stored"
                    />
                </Col>
                <Col sm={6} md={4} className="py-3">
                    <DashboardCard
                        number={avgFileSize}
                        Icon={FaFileInvoice}
                        description="Average File Size"
                    />
                </Col>
            </Row>
            <LineChart data={plotData} />
        </Container>
    );
};

export default DashboardScreen;
