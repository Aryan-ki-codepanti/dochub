import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Row } from "react-bootstrap";

import "./VideoCallScreen.css";

const VideoCallScreen = () => {
    const { userInfo, mySocket } = useSelector(state => state.auth);

    const myVideo = useRef();
    const [myStream, setMyStream] = useState(null);

    useEffect(() => {
        if (mySocket && userInfo) {
            mySocket.emit("join-vc", {
                _id: userInfo._id,
                name: userInfo.name
            });

            // ask perms
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then(stream => {
                    setMyStream(prev => stream);
                    if (myVideo.current) myVideo.current.srcObject = stream;
                });
        }
    }, [mySocket, userInfo]);

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
                    <h4 className="text-center">Friend</h4>
                </div>
            </Row>
        </div>
    );
};

export default VideoCallScreen;
