import {
    Container,
    Card,
    Button,
    ButtonGroup,
    Tabs,
    Tab
} from "react-bootstrap";
import Users from "./Users";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useGetAllPeopleMutation } from "../slices/friendsApiSlice";
import Loader from "./Loader";
import { setCredentials } from "../slices/authSlice";

const Hero = () => {
    const { userInfo } = useSelector(state => state.auth);
    const [peopleFilter, setPeopleFilter] = useState("all");
    const [getAllPeople, { isLoading }] = useGetAllPeopleMutation();

    const dispatch = useDispatch();

    useEffect(() => {
        // fetch people
        const fetchPeople = async () => {
            try {
                const data = await getAllPeople().unwrap();
                dispatch(setCredentials({ ...userInfo, people: data.people }));
            } catch (error) {
                console.log("FETCH PEOPLE", error);
            }
        };
        fetchPeople();
    }, [getAllPeople]);

    return (
        <div className=" py-5">
            <Container className="">
                <Tabs
                    id="controlled-tab-example"
                    activeKey={peopleFilter}
                    onSelect={k => setPeopleFilter(k)}
                    className="mb-3"
                >
                    <Tab eventKey="all" title="All"></Tab>
                    <Tab eventKey="requests" title="Requests"></Tab>
                    <Tab eventKey="friends" title="My Friends"></Tab>
                </Tabs>
                <Users
                    peopleFilter={peopleFilter}
                    users={userInfo.people || []}
                />
            </Container>
            {isLoading && <Loader />}
        </div>
    );
};

export default Hero;
