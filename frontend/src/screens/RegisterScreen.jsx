import { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
// import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";

const OrDivider = () => {
    return (
        <Row className="align-items-center my-3">
            <Col>
                <hr className="border-secondary" />
            </Col>
            <Col xs="auto">
                <span className="text-muted">OR</span>
            </Col>
            <Col>
                <hr className="border-secondary" />
            </Col>
        </Row>
    );
};

const RegisterScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [dob, setDob] = useState(new Date().toISOString().split("T")[0]);
    const [gender, setGender] = useState("M");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, { isLoading }] = useRegisterMutation();

    const { userInfo } = useSelector(state => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate("/");
        }
    }, [navigate, userInfo]);

    const submitHandler = async e => {
        e.preventDefault();
        const countAlpha = str => {
            let cnt = 0;
            for (const char of str.toLowerCase())
                if (char >= "a" && char <= "z") cnt += 1;
            return cnt;
        };
        const regExp = /[a-zA-Z]/g;

        if (!password || !confirmPassword || !email || !name) {
            toast.error("Please fill all the fields");
            return;
        } else if (!/^[A-Za-z ]+$/.test(name) || !regExp.test(name)) {
            toast.error("Name should have only alphabets only");
            return;
        } else if (countAlpha(name) < 3) {
            toast.error("Name should have atleast 3 alphabets");
        } else if (password !== confirmPassword) {
            toast.error("Passwords do not match");
        } else {
            // check if person is > 18yrs
            const inputDate = new Date(dob);
            const today = new Date();
            const adultDate = new Date(
                today.getFullYear() - 18,
                today.getMonth(),
                today.getDate()
            );

            if (inputDate > adultDate) {
                toast.error("You should be more than 18yrs of age");
                return;
            }
            try {
                const res = await register({
                    name,
                    email,
                    password,
                    gender,
                    dob: inputDate
                }).unwrap();
                dispatch(setCredentials({ ...res }));
                navigate("/");
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };
    return (
        <FormContainer>
            <h1>Register</h1>
            <OAuth />
            <OrDivider />
            <Form onSubmit={submitHandler}>
                <Form.Group className="my-2" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="name"
                        placeholder="Enter name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className="my-2" controlId="email">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className="my-2" controlId="dob">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                        type="date"
                        value={dob}
                        onChange={e => setDob(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className="my-2" controlId="gender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                        value={gender}
                        onChange={e => setGender(e.target.value)}
                        aria-label="Select gender"
                    >
                        <option>Open this select menu</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="my-2" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group className="my-2" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type="submit" variant="primary" className="mt-3">
                    Register
                </Button>

                {isLoading && <Loader />}
            </Form>

            <Row className="py-3">
                <Col>
                    Already have an account? <Link to={`/login`}>Login</Link>
                </Col>
            </Row>
        </FormContainer>
    );
};

export default RegisterScreen;
