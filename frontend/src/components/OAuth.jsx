import React from "react";
import { Button } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";
import { app } from "../firebase";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import { useGoogleAuthUserMutation } from "../slices/usersApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [googleAuth] = useGoogleAuthUserMutation();

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);

            // send to backend
            const googleUser = await googleAuth({
                name: resultsFromGoogle.user.displayName,
                pic: resultsFromGoogle.user.photoURL,
                email: resultsFromGoogle.user.email
            }).unwrap();

            toast.success("Signed in with Google");

            // update state userInfo to received user
            dispatch(setCredentials({ ...googleUser }));
            navigate("/");
        } catch (error) {
            console.log("Google Signin error", error);
            toast.error("Couldn't signin from google");
        }
    };
    return (
        <Button
            className="d-flex align-items-center gap-2 border border-1 justify-content-center"
            variant="light"
            onClick={handleGoogleClick}
        >
            <FcGoogle />
            Sign in with Google
        </Button>
    );
};

export default OAuth;
