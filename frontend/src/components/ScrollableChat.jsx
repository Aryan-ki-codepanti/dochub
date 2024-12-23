import React from "react";
import { useSelector } from "react-redux";
import ScrollableFeed from "react-scrollable-feed";
import {
    isLastMessage,
    isSameSender,
    isSameSenderMargin,
    isSameUser
} from "../config/chatLogics";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import Avatar from "./Misc/Avatar";
import maleAvatar from "../assets/male.png";
import femaleAvatar from "../assets/female.png";

const ScrollableChat = ({ messages }) => {
    const { userInfo } = useSelector(state => state.auth);

    return (
        <ScrollableFeed>
            {messages?.map((m, i) => (
                <div key={m._id} className="d-flex">
                    {(isSameSender(messages, m, i, userInfo._id) ||
                        isLastMessage(messages, i, userInfo._id)) && (
                        <OverlayTrigger
                            placement="bottom"
                            overlay={
                                <Tooltip id={`tooltip-bottom`}>
                                    {m.sender.name}
                                </Tooltip>
                            }
                        >
                            <span
                                className="me-3 "
                                style={{ marginTop: "7px" }}
                            >
                                <Avatar
                                    name={m.sender.name}
                                    size="sm"
                                    src={
                                        m.sender.pic ||
                                        (m.sender.gender === "M"
                                            ? maleAvatar
                                            : femaleAvatar)
                                    }
                                />
                            </span>
                        </OverlayTrigger>
                    )}
                    <span
                        style={{
                            backgroundColor: `${
                                m.sender._id === userInfo._id
                                    ? "#bee3f8"
                                    : "#b9f5d0"
                            }`,
                            borderRadius: "20px",
                            padding: "5px 15px",
                            maxWidth: "75%",
                            marginLeft: isSameSenderMargin(
                                messages,
                                m,
                                i,
                                userInfo._id
                            ),
                            marginTop: isSameUser(messages, m, i) ? 3 : 10
                        }}
                    >
                        {m.content}
                    </span>
                </div>
            ))}
        </ScrollableFeed>
    );
};

export default ScrollableChat;
