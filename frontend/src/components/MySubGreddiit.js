import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, ListGroup, Card, Form, Row, Col, Button } from 'react-bootstrap'
import NavigationBar from "./NavigationBar";
import axios from "axios";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { IoCloseCircleOutline, IoCheckmarkCircleOutline } from "react-icons/io5";

function NavigationTabs() {

    const [Followers, setFollowers] = useState([]);
    const [BlockedUsers, setBlockedUsers] = useState([]);
    const [JoinRequests, setJoinRequests] = useState([]);
    const [Reports, setReports] = useState([]);
    const [Modified, setModified] = useState("no");
    const [Changed, setChanged] = useState("no");
    const [SubGredName, setSubGredName] = useState("")
    const { subgred_id } = useParams();

    useEffect(() => {
        axios.get('/api/subgreddiit', { headers: { Authorization: localStorage.getItem('token') }, params: { id: subgred_id } })
            .then(res => {
                setFollowers(res.data.followers);
                setBlockedUsers(res.data.blockedusers);
                setJoinRequests(res.data.joinreq);
                setSubGredName(res.data.name)
                setModified("no");
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Modified]);

    useEffect(() => {
        axios.get('/api/reports', { headers: { Authorization: localStorage.getItem('token') }, params: { id: subgred_id } })
            .then(res => {
                setReports(res.data);
                // console.log(res)
                setChanged("no");

            })


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Changed]);

    function Users() {

        return (
            <>
                <Container className="mt-5">
                    <h1>Users</h1>
                    <br /><br /><br />
                    <h3>Followers</h3>
                    <ListGroup variant="flush" as="ol" numbered style={{ "height": "25vh", "overflowY": "scroll" }}>
                        {React.Children.toArray(Followers.map((follower) => <ListGroup.Item>{follower}</ListGroup.Item>))}
                    </ListGroup>
                    <br /><br /><br />
                    <h3>Blocked Users</h3>
                    <ListGroup variant="flush" as="ol" numbered style={{ "height": "25vh", "overflowY": "scroll" }}>
                        {React.Children.toArray(BlockedUsers.map((follower) => <ListGroup.Item>{follower}</ListGroup.Item>))}
                    </ListGroup>
                </Container>
            </>
        )
    }

    function Requests() {

        function HandleAccept(user) {
            axios.post("/api/acceptrequest",
                { subgred_id, user },
                { headers: { Authorization: localStorage.getItem('token') } }
            )
                .then(res => console.log(res))
                .catch(err => console.log(err));
            setModified("yes");
        }

        function HandleReject(user) {
            axios.post("/api/rejectrequest",
                { subgred_id, user },
                { headers: { Authorization: localStorage.getItem('token') } }
            )
                .then(res => console.log(res))
                .catch(err => console.log(err));
            setModified("yes");
        }

        return (
            <>
                <Container className="mt-5">
                    <h1>Requests</h1>
                    <br /><br /><br />
                    <ListGroup variant="flush" >
                        {JoinRequests.map((user) =>
                            <ListGroup.Item>
                                {user}
                                <IoCloseCircleOutline style={{ "float": 'right', "margin": "0 10px", "cursor": "pointer" }} size="25px" onClick={() => HandleReject(user)} />
                                <IoCheckmarkCircleOutline style={{ "float": 'right', "cursor": "pointer" }} size="25px" onClick={() => HandleAccept(user)} />
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Container>
            </>
        )
    }

    function Stats() {
        return (
            <>
                <Container className="mt-5">
                    <h1>Stats</h1>
                </Container>
            </>
        )
    }

    function Reported() {

        function ReportCard(props) {

            var report = props.report

            const [BlockButtonText, setBlockButtonText] = useState("Block User")
            const [TimerId, setTimerId] = useState(0)
            const [BlockClicked, setBlockClicked] = useState(false)

            function DeletePost() {
                axios.post("/api/deletepost",
                    { report },
                    { headers: { Authorization: localStorage.getItem('token') } }
                )
                    .then(res => console.log(res))
                    .catch(err => console.log(err));

                setChanged("yes");
            }

            function IgnoreReport() {
                axios.post("/api/ignorereport",
                    { report },
                    { headers: { Authorization: localStorage.getItem('token') } }
                )
                    .then(res => console.log(res))
                    .catch(err => console.log(err));

                setChanged("yes");
            }

            function UnignoreReport() {
                axios.post("/api/unignorereport",
                    { report },
                    { headers: { Authorization: localStorage.getItem('token') } }
                )
                    .then(res => console.log(res))
                    .catch(err => console.log(err));

                setChanged("yes");
            }

            function BlockUser() {
                if (BlockClicked) {
                    clearInterval(TimerId)
                    setBlockClicked(false)
                    setBlockButtonText("Block User")
                    return;
                }
                var time = 3
                setBlockButtonText("Cancel in 3 sec")
                var timerId = setInterval(() => {
                    time--;
                    if (time === 2) setBlockButtonText("Cancel in 2 sec")
                    if (time === 1) setBlockButtonText("Cancel in 1 sec")
                    if (time === 0) {
                        clearInterval(timerId)
                        setBlockButtonText("Blocked")
                        axios.post("/api/blockuser",
                            { report },
                            { headers: { Authorization: localStorage.getItem('token') } }
                        )
                            .then(res => console.log(res))
                            .catch(err => console.log(err));

                        setChanged("yes");
                        setModified("yes");
                    }
                }, 1000)
                setTimerId(timerId)
                setBlockClicked(true)
            }

            return (
                <Card>
                    <Card.Body>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="2"> Reported By :</Form.Label>
                            <Col sm="10">
                                <Form.Control plaintext readOnly defaultValue={report.reportedby} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="2"> Reported User :</Form.Label>
                            <Col sm="10">
                                <Form.Control plaintext readOnly defaultValue={report.reporteduser} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="2"> Concern :</Form.Label>
                            <Col sm="10">
                                <Form.Control plaintext readOnly defaultValue={report.concern} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="2"> Post Text :</Form.Label>
                            <Col sm="10">
                                <Form.Control plaintext readOnly defaultValue={report.posttext} />
                            </Col>
                        </Form.Group>
                        <br />
                        {!report.ignore && <Button className="mx-2" disabled={BlockedUsers.includes(report.reporteduser)} onClick={IgnoreReport}>Ignore</Button>}
                        {report.ignore && <Button className="mx-2" disabled={BlockedUsers.includes(report.reporteduser)} onClick={UnignoreReport}>Unignore</Button>}
                        {!BlockedUsers.includes(report.reporteduser) && <Button className="mx-2" disabled={report.ignore} onClick={BlockUser}>{BlockButtonText}</Button>}
                        {BlockedUsers.includes(report.reporteduser) && <Button className="mx-2" disabled>Blocked</Button>}
                        <Button className="mx-2" disabled={report.ignore || BlockedUsers.includes(report.reporteduser)} onClick={DeletePost}>Delete Post</Button>
                    </Card.Body>
                </Card>
            );
        }

        return (
            <>
                <Container className="mt-5"  >
                    <h1 className="mb-5">Reported</h1>
                    {React.Children.toArray(Reports.map((report) => {
                        return (
                            <>
                                <ReportCard report={report} />
                                <br /><br />
                            </>)
                    }))}
                </Container>
            </>
        )
    }


    return (
        <Tabs
            defaultActiveKey="users"
            style={{ "marginTop": "60px" }}
        >
            <Tab eventKey="subgreddiitname" title={SubGredName} disabled></Tab>
            <Tab eventKey="users" title="Users">
                <Users />
            </Tab>
            <Tab eventKey="requests" title="Requests">
                <Requests />
            </Tab>
            <Tab eventKey="stats" title="Stats" >
                <Stats />
            </Tab>
            <Tab eventKey="reported" title="Reported" >
                <Reported />
            </Tab>
        </Tabs>
    );
}


function MySubGreddiit() {

    return (
        <>
            <NavigationBar />
            <NavigationTabs />
        </>
    )
}

export default MySubGreddiit;