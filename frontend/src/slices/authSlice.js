import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null,
    chatInfo: {
        selectedChat: null,
        chats: []
    },
    activeUsers: [],
    mySocket: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem("userInfo", JSON.stringify(action.payload));
        },
        setChatInfo: (state, action) => {
            state.chatInfo = action.payload;
        },
        setActiveUsers: (state, action) => {
            state.activeUsers = action.payload;
        },
        logout: (state, action) => {
            state.userInfo = null;
            localStorage.removeItem("userInfo");
        },
        setMySocket: (state, action) => {
            state.mySocket = action.payload;
        }
    }
});

export const {
    setCredentials,
    logout,
    setChatInfo,
    setActiveUsers,
    setMySocket
} = authSlice.actions;

export default authSlice.reducer;
