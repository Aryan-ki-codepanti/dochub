import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider
} from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import store from "./store";
import { Provider } from "react-redux";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen.jsx";
import RegisterScreen from "./screens/RegisterScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import ChatPage from "./screens/ChatPage.jsx";
import DrivePage from "./screens/DrivePage.jsx";
import VideoCallScreen from "./screens/VideoCallScreen";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route index={true} path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="" element={<PrivateRoute />}>
                <Route path="/profile" element={<ProfileScreen />} />
                <Route path="/chats" element={<ChatPage />} />
                <Route path="/drive" element={<DrivePage />} />
                <Route path="/video-call" element={<VideoCallScreen />} />
            </Route>
        </Route>
    )
);

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        {/* <React.StrictMode> */}
        <RouterProvider router={router} />
        {/* </React.StrictMode> */}
    </Provider>
);
