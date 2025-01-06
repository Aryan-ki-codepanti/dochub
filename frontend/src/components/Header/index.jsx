// import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaSignInAlt, FaSignOutAlt, FaRocketchat } from "react-icons/fa";
import { GrStorage, GrVideo } from "react-icons/gr";

import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../slices/usersApiSlice";
import { logout } from "../../slices/authSlice";

import Avatar from "../Misc/Avatar";
import "./Header.css";

import maleAvatar from "../../assets/male.png";
import femaleAvatar from "../../assets/female.png";
import { toast } from "react-toastify";

const Header = () => {
    const { userInfo, mySocket } = useSelector(state => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            if (mySocket) {
                // remove user from active
                mySocket.off("disconnect");
                mySocket.disconnect();
            }
            dispatch(logout());
            toast.success("Logged out successfully 😌");
            navigate("/login");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>DocHub</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            {userInfo ? (
                                <>
                                    <LinkContainer to="/video-call">
                                        <Nav.Link className="d-flex align-items-center gap-2 drive-icon">
                                            <GrVideo size={20} />
                                            CamHub
                                        </Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/drive">
                                        <Nav.Link className="d-flex align-items-center gap-2 drive-icon">
                                            <GrStorage size={20} />
                                            Drive
                                        </Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/chats">
                                        <Nav.Link className="d-flex align-items-center gap-2">
                                            <FaRocketchat size={20} /> Chats
                                        </Nav.Link>
                                    </LinkContainer>
                                    <NavDropdown
                                        className="d-flex align-items-center"
                                        title={
                                            <div className="d-flex align-items-center gap-2">
                                                <Avatar
                                                    name={userInfo.name}
                                                    size="sm"
                                                    src={
                                                        userInfo.pic ||
                                                        (userInfo.gender === "M"
                                                            ? maleAvatar
                                                            : femaleAvatar)
                                                    }
                                                />
                                                {userInfo.name}
                                            </div>
                                        }
                                        id="username"
                                    >
                                        <LinkContainer to="/profile">
                                            <NavDropdown.Item>
                                                Profile
                                            </NavDropdown.Item>
                                        </LinkContainer>
                                        <NavDropdown.Item
                                            onClick={logoutHandler}
                                        >
                                            Logout
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                </>
                            ) : (
                                <>
                                    <LinkContainer to="/login">
                                        <Nav.Link>
                                            <FaSignInAlt /> Sign In
                                        </Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/register">
                                        <Nav.Link>
                                            <FaSignOutAlt /> Sign Up
                                        </Nav.Link>
                                    </LinkContainer>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
