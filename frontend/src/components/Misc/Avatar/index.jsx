import React from "react";
import { Image } from "react-bootstrap";
import "./Avatar.css";

const Avatar = ({ name, src, size = "md", cursor = "pointer" }) => {
    const sizes = {
        sm: "40px",
        md: "60px",
        lg: "100px"
    };

    return (
        <div
            className="avatar"
            style={{
                width: sizes[size] || sizes.md,
                height: sizes[size] || sizes.md,
                cursor: cursor
            }}
        >
            {src ? (
                <Image
                    src={src}
                    roundedCircle
                    className="avatar-img"
                    alt={name}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                    }}
                />
            ) : (
                <div className="avatar-initials">{name}</div>
            )}
        </div>
    );
};

export default Avatar;
