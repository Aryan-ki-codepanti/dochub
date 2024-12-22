import React from "react";
import { IoCloseSharp } from "react-icons/io5";

const UserBadgeItem = ({ user, handleFunc }) => {
    return (
        <div
            className="px-2 py-1 rounded m-1 mb-2 d-flex align-items-center text-white "
            onClick={handleFunc}
            style={{
                cursor: "pointer",
                fontSize: "12px",
                backgroundColor: "#994aff"
            }}
        >
            {user.name}
            <IoCloseSharp size={16} />
        </div>
    );
};

export default UserBadgeItem;

/*
--chakra-colors-brand-50: #f5e9ff;
--chakra-colors-brand-100: #e4c7ff;
--chakra-colors-brand-200: #d3a6ff;
--chakra-colors-brand-300: #c285ff;
--chakra-colors-brand-400: #b264ff;
--chakra-colors-brand-500: #994aff;
--chakra-colors-brand-600: #7938cc;
--chakra-colors-brand-700: #5a2a99;
--chakra-colors-brand-800: #3b1c66;
--chakra-colors-brand-900: #1d0e33;
*/
