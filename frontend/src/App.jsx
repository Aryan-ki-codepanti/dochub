import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { setActiveUsers, setMySocket } from "./slices/authSlice";

let socket;
const App = () => {
    const { userInfo } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        socket =
            import.meta.env.MODE === "development"
                ? io(import.meta.env.VITE_APP_BACKEND_URL)
                : io();
        dispatch(setMySocket(socket));
        if (userInfo?._id) socket.emit("heartbeat", userInfo._id);
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        socket.on("update-active-users", active => {
            dispatch(
                setActiveUsers(
                    active.filter(
                        x => !!userInfo.friends.find(f => f.user === x)
                    )
                )
            );
        });
    }, []);

    return (
        <>
            <Header />
            <ToastContainer />
            <Container className="my-2">
                <Outlet />
            </Container>
        </>
    );
};

export default App;
