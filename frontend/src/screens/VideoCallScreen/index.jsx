import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Row } from "react-bootstrap";
import { toast } from "react-toastify";

import "./VideoCallScreen.css";
import { useGetMyFriendsMutation } from "../../slices/friendsApiSlice";

const VideoCallScreen = () => {
    const { userInfo, mySocket } = useSelector(state => state.auth);
    const [getMyFriendsAPI] = useGetMyFriendsMutation();

    const myVideo = useRef();
    const [myStream, setMyStream] = useState(null);
    const [mySockId, setMySockId] = useState(null);
    const [friendToCall, setFriendToCall] = useState(null);

    const connectionRef = useRef(); // current user peer connection ref

    const callToFriend = friendId => {
        console.log("Call friend ", friendId);
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
        }
    }, [mySocket, userInfo]);

    const fetchMyFriends = async () => {
        try {
            const data = await getMyFriendsAPI().unwrap();
            console.log("my Friends", data);
        } catch (error) {
            toast.error("Error in fetching friends");
            console.log("Fetch MY friends error", error);
        }
    };
    useEffect(() => {
        fetchMyFriends();
    }, []);

    return (
        <div>
            <Row>
                <div className="col-sm-6">
                    <h4 className="text-center">My Video</h4>
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
                        <h4 className="text-center">Friend</h4>
                    ) : (
                        <>
                            <h4 className="text-center">Who to Call?</h4>
                            {userInfo?.friends.map(f => (
                                <h2 key={f.user}>{f.user}</h2>
                            ))}
                        </>
                    )}
                </div>
            </Row>
        </div>
    );
};

export default VideoCallScreen;
