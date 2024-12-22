import { useSelector } from "react-redux";
import Hero from "../components/Hero";
import { Button } from "react-bootstrap";

const HomeScreen = () => {
    const { userInfo } = useSelector(state => state.auth);

    return (
        <>
            {userInfo ? (
                <Hero />
            ) : (
                <div className="d-flex flex-column align-items-center justify-content-center mt-5">
                    <h1>You may login / signup</h1>

                    <div className="d-flex">
                        <Button
                            variant="primary"
                            href="/login"
                            className="me-3"
                        >
                            Sign In
                        </Button>
                        <Button variant="secondary" href="/register">
                            Register
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};
export default HomeScreen;
