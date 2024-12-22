import React from "react";
import "./UserListItem.css";

const UserListItem = ({ user, handleFunc }) => {
    return (
        <div
            className="user-list-item d-flex align-self-start  mb-2 py-2 px-3 rounded"
            style={{ cursor: "pointer" }}
            onClick={handleFunc}
        >
            <div>
                <div className="fw-bold">{user.name}</div>
                <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                    <b>Email:</b> {user.email}
                </div>
            </div>
        </div>
    );
};

export default UserListItem;
