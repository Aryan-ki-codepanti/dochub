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
    getPiePlotFileData,
    getPlotFileData,
    getPlotMessagesData,
    getTotalMessages,
    mergePlotData
} from "../../config/dashboardLogics";
import { toast } from "react-toastify";
import { getSender } from "../../config/chatLogics";
import { useGetFilesInfoMutation } from "../../slices/filesApiSlice";
import { filesize } from "filesize";
import LineChart from "../../components/LineChart";
import PieChart from "../../components/PieChart";

const initialPlotData = {
    labels: ["2024-12-01", "2024-12-02", "2024-12-03"], // Dates
    datasets: [
        {
            label: "null",
            data: [5, 10, 7], // Messages corresponding to dates
            fill: false,
            backgroundColor: "#007bff", //"#4bc0c0",
            borderColor: "rgba(75, 192, 192, 0.2)"
        }
    ]
};

const fileTypePieInitialData = {
    labels: ["Text Messages", "File Attachments", "Links"],
    datasets: [
        {
            label: "Message Types",
            data: [60, 25, 15], // Replace with your actual data
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            hoverBackgroundColor: ["#FF6384CC", "#36A2EBCC", "#FFCE56CC"]
        }
    ]
};

const DashboardScreen = () => {
    const { userInfo, chatInfo } = useSelector(state => state.auth);

    const [myChats, setMyChats] = useState([]);

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

    // loading
    const [chatLoading, setChatLoading] = useState(false);
    const [fileLoading, setFileLoading] = useState(false);
    const [messageLoading, setMessageLoading] = useState(false);

    const [myFilesCount, setMyFilesCount] = useState(0);
    const [avgFileSize, setAvgFileSize] = useState(0);
    const [plotData, setPlotData] = useState(initialPlotData);
    const [plotFileData, setPlotFileData] = useState(initialPlotData);

    const [linePlotData, setLinePlotData] = useState(initialPlotData);
    const [fileTypePieData, setFileTypePieData] = useState(
        fileTypePieInitialData
    );

    const fetchMessagesForChats = async () => {
        setMessageLoading(prev => true);

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
            setMessagesCount(prev =>
                getTotalMessages(userInfo?._id, transformedMessages)
            );

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

            // plot date vs no. of messages sent
            const msgMap = getPlotMessagesData(
                userInfo?._id,
                transformedMessages
            );

            const newPlotData = structuredClone(initialPlotData);
            newPlotData.labels = Object.keys(msgMap);
            newPlotData.datasets[0].data = Object.values(msgMap);
            newPlotData.datasets[0].label = "Messages Sent";
            setPlotData(prev => newPlotData);
        } catch (err) {
            console.error("Error fetching messages:", err.message);
            toast.error("Error fetching messages");
        } finally {
            setMessageLoading(prev => false);
        }
    };

    const fetchFileData = async () => {
        setFileLoading(prev => true);

        try {
            const data = await getFilesInfoAPI().unwrap();
            setMyFilesCount(prev => data.length);

            let s;
            if (data.length > 0) {
                s = Math.floor(
                    data.reduce((acc, f) => acc + f.size, 0) / data.length
                );
            } else s = 0;
            setAvgFileSize(prev => filesize(s));

            const fileMap = getPlotFileData(data);

            const newFilePlotData = structuredClone(initialPlotData);
            newFilePlotData.labels = Object.keys(fileMap);
            newFilePlotData.datasets[0].data = Object.values(fileMap);
            newFilePlotData.datasets[0].label = "Files Uploaded";
            newFilePlotData.datasets[0].backgroundColor = "#f26b5a";
            newFilePlotData.datasets[0].borderColor = "#d8b7bc";
            setPlotFileData(prev => newFilePlotData);

            const pieD = getPiePlotFileData(data);
            const newPie = structuredClone(fileTypePieInitialData);
            newPie.labels = Object.keys(pieD);
            newPie.datasets[0].data = Object.values(pieD);
            setFileTypePieData(prev => newPie);
        } catch (error) {
            console.log("Fetch File Error", error);
            toast.error("Fetch File Error");
        } finally {
            setFileLoading(prev => false);
        }
    };

    const fetchData = async () => {
        try {
            setChatLoading(prev => true);

            setFriendsCount(prev =>
                userInfo.friends ? userInfo.friends.length : 0
            );
            // load iff chats not loaded
            let allChats = [];
            if (!chatInfo.chats?.length) allChats = await fetchChats().unwrap();
            else allChats = chatInfo.chats;
            setChatCount(prev => allChats.length);
            setMyChats(prev => allChats);
        } catch (error) {
            console.log("Fetch Chats Error", error);
            toast.error("Fetch Chats Error");
        } finally {
            setChatLoading(prev => false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchFileData();
    }, []);

    useEffect(() => {
        // messages related data
        fetchMessagesForChats();
    }, [myChats]);

    useEffect(() => {
        if (plotData != initialPlotData && plotFileData != initialPlotData)
            setLinePlotData(prev => mergePlotData(plotData, plotFileData));
    }, [plotData, plotFileData]);

    return (
        <Container className="mt-4" style={{ fontFamily: "Work Sans" }}>
            <h1 className="text-center">Your Account & Usage Summarised</h1>
            <Row>
                <Col sm={12} md={8}>
                    <Row>
                        <Col sm={6} md={6} className="py-3">
                            <DashboardCard
                                number={friendsCount}
                                Icon={FaUserFriends}
                                description="Friends"
                                loading={chatLoading}
                            />
                        </Col>
                        <Col sm={6} md={6} className="py-3">
                            <DashboardCard
                                number={chatCount}
                                Icon={IoMdChatboxes}
                                description="Chats"
                                loading={chatLoading}
                            />
                        </Col>

                        <Col sm={6} md={6} className="py-3">
                            <DashboardCard
                                number={messagesCount}
                                Icon={FaEnvelope}
                                description="Messages Sent"
                                loading={messageLoading}
                            />
                        </Col>

                        <Col sm={6} md={6} className="py-3">
                            <DashboardCard
                                number={
                                    myChats.length
                                        ? Math.floor(
                                              messagesCount / myChats.length
                                          )
                                        : 0
                                }
                                Icon={TiMessages}
                                description="Average Messages Per Chat"
                                loading={messageLoading}
                            />
                        </Col>
                        <Col sm={6} md={6} className="py-3">
                            <DashboardCard
                                number={favouriteGroupMsgCount}
                                Icon={IoIosChatbubbles}
                                description={
                                    favouriteGroupMsgCount
                                        ? `Total Messages shared in Favourite Group "${favouriteGroup}"`
                                        : "No Favourite Group"
                                }
                                loading={messageLoading}
                            />
                        </Col>
                        <Col sm={6} md={6} className="py-3">
                            <DashboardCard
                                number={favouriteFriendMsgCount}
                                Icon={IoIosChatbubbles}
                                description={
                                    favouriteFriendMsgCount
                                        ? `Total Messages shared with favourite friend "${favouriteFriend}"`
                                        : "No Favourite Friend"
                                }
                                loading={messageLoading}
                            />
                        </Col>
                        <Col sm={6} md={6} className="py-3">
                            <DashboardCard
                                number={myFilesCount}
                                Icon={FaFileAlt}
                                description="Personal Files stored"
                                loading={fileLoading}
                            />
                        </Col>
                        <Col sm={6} md={6} className="py-3">
                            <DashboardCard
                                number={avgFileSize}
                                Icon={FaFileInvoice}
                                description="Average File Size"
                                loading={fileLoading}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col className="d-flex flex-column align-items-center justify-content-center">
                    <div className="dashboard-card card shadow-sm">
                        <h5
                            style={{ marginBlock: "10px -10px" }}
                            className="text-center"
                        >
                            Frequency
                        </h5>
                        <LineChart data={linePlotData} />
                    </div>

                    <div className="dashboard-card card shadow-sm mt-2">
                        <h5
                            style={{ marginBlock: "10px -5px" }}
                            className="text-center"
                        >
                            File Type
                        </h5>
                        <PieChart pieData={fileTypePieData} />
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardScreen;
