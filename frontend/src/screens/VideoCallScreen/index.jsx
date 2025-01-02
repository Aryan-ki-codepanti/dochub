import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row } from "react-bootstrap";
import { toast } from "react-toastify";

import "./VideoCallScreen.css";
import { useGetMyFriendsMutation } from "../../slices/friendsApiSlice";
import { setCredentials } from "../../slices/authSlice";
import { FaVideo } from "react-icons/fa";
// import Peer from "simple-peer";
import Peer from "simple-peer/simplepeer.min.js";
import Calling from "../../components/Calling";
// const peer = require("simple-peer");

const VideoCallScreen = () => {
    const { userInfo, mySocket, activeUsers } = useSelector(
        state => state.auth
    );
    const [getMyFriendsAPI] = useGetMyFriendsMutation();
    const dispatch = useDispatch();

    const myVideo = useRef();
    const [myStream, setMyStream] = useState(null);
    const [mySockId, setMySockId] = useState(null);
    const [friendToCall, setFriendToCall] = useState(null);

    const connectionRef = useRef(); // current user peer connection ref

    // caller info
    const [receivingCall, setReceivingCall] = useState(false);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callerInfo, setCallerInfo] = useState(null);

    const callToFriend = friend => {
        // dont call if user is offline
        if (!activeUsers.includes(friend._id)) {
            toast.warn(`${friend.name} is offline`);
            return;
        }
        // setFriendToCall(prev => friend)
        console.log("Call friend ", friend._id);

        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: myStream
        });

        peer.on("signal", data => {
            console.log("call to friend with signal event");
            mySocket.emit("callToFriend", {
                callToFriendId: friend._id,
                signalData: data,
                from: mySockId,
                name: userInfo.name
            });
        });

        connectionRef.current = peer;
    };

    const handleRejectCall = () => {
        setReceivingCall(prev => false);
        setCallAccepted(prev => false);
        mySocket.emit("reject-call", { to: callerInfo, name: userInfo.name });
    };

    useEffect(() => {
        if (mySocket && userInfo) {
            //heartbeat already emitted

            // ask perms
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then(stream => {
                    setMyStream(prev => stream);
                    if (myVideo.current) myVideo.current.srcObject = stream;
                });

            mySocket.on("my-sock-id", sockId => {
                setMySockId(prev => sockId);
                console.log("my sock : ", sockId);
            });

            mySocket.on("callToFriend", data => {
                console.log("Incoming call from another user : ", data);
                setReceivingCall(prev => true);
                setCallerInfo(prev => data);
            });

            mySocket.on("callRejected", ({ name }) => {
                toast.info(`Call rejected  by ${name}`);
            });
        }
    }, [mySocket]);

    const fetchMyFriends = async () => {
        try {
            const data = await getMyFriendsAPI().unwrap();
            dispatch(setCredentials({ ...userInfo, friendsInfo: data }));
        } catch (error) {
            toast.error("Error in fetching friends");
            console.log("Fetch MY friends error", error);
        }
    };
    useEffect(() => {
        fetchMyFriends();
    }, []);

    return (
        <div className="mt-5" style={{ fontFamily: "Work Sans" }}>
            <Row className="">
                <div className="col-sm-6">
                    <h2 className="text-center mb-3">My Video</h2>
                    <video
                        id="my-video"
                        className="w-100"
                        ref={myVideo => {
                            if (myVideo && myStream)
                                myVideo.srcObject = myStream;
                        }}
                        autoPlay
                        muted
                    ></video>
                </div>

                <div className="col-sm-6">
                    {friendToCall ? (
                        <h2 className="text-center  mb-3">Friend</h2>
                    ) : (
                        <>
                            <h2 className="text-center  mb-3">Who to Call?</h2>
                            <Row className="gap-2">
                                {userInfo?.friendsInfo.map(f => (
                                    <div
                                        onClick={e => callToFriend(f.user)}
                                        key={f.user._id}
                                        className={`friendItem ${
                                            activeUsers.includes(f.user._id)
                                                ? "online"
                                                : "offline"
                                        } col-md-4 border rounded-2 px-4 py-2 bg-light d-flex align-items-center justify-content-between`}
                                    >
                                        <span>{f.user.name}</span>
                                        <FaVideo
                                            className="vidIcon rounded-circle p-2"
                                            fill="#fff"
                                            size={35}
                                        />
                                    </div>
                                ))}
                            </Row>

                            {receivingCall && !callAccepted && (
                                <Calling
                                    rejectCall={handleRejectCall}
                                    callerName={callerInfo?.name}
                                />
                            )}
                        </>
                    )}
                </div>
            </Row>
        </div>
    );
};

export default VideoCallScreen;
