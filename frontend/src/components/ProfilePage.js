import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, FormGroup, FormControl, FormLabel } from 'react-bootstrap'
import Image from 'react-bootstrap/Image'
import { FollowersModal, FollowingModal } from "./Modal";
import NavigationBar from "./NavigationBar";
import ProfileImg from "../assets/ProfileImage.png";
import axios from "axios";

function Profile() {

    const [Edit, setEdit] = useState("no");
    const [FirstName, setFirstName] = useState("");
    const [LastName, setLastName] = useState("");
    const [Username, setUsername] = useState("");
    const [Email, setEmail] = useState("");
    const [Age, setAge] = useState("");
    const [ContactNumber, setContactNumber] = useState("");


    function handleEdit() {
        return Edit === "no";
    }

    function EditProfileButton() {
        return (
            <div className="mt-5 text-center">
                <Button variant="primary" onClick={() => setEdit("yes")}>
                    Edit Profile
                </Button>
            </div>

        );
    };

    function SaveProfileButton() {
        return (
            <div className="mt-5 text-center">
                <Button variant="primary" onClick={HandleSubmit}>
                    Save Profile
                </Button>
            </div>
        );
    }

    function HandleSubmit(event) {
        setEdit("no");
        console.log("submitted");
        event.preventDefault();


        axios.post("/api/editprofile",
            { FirstName, LastName, Username, Email, Age, ContactNumber },
            { headers: { Authorization: localStorage.getItem('token') } }
        )
            .then(res => console.log(res))
            .catch(err => console.log(err));

    }

    useEffect(() => {
        axios.get('/api/profile', { headers: { Authorization: localStorage.getItem('token') } })
            .then(res => {
                console.log(res.data);
                setFirstName(res.data.firstname);
                setLastName(res.data.lastname);
                setUsername(res.data.username);
                setEmail(res.data.email);
                setAge(res.data.age);
                setContactNumber(res.data.contactnumber);
            })
    }, []);

    return (
        <Container style={{ "marginTop": "100px" }}>
            <Row>
                <Col md={3} className="border-right">
                    <div className="d-flex flex-column align-items-center text-center p-3 py-5"><Image className="mt-5" src={ProfileImg} alt="profile-img" />{Username}</div>
                    <div className="mt-5 text-center"><FollowersModal /></div>
                    <div className="mt-2 text-center"><FollowingModal /></div>
                </Col>
                <Col md={9} className="border-right">
                    <div className="p-3 py-5">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h1 className="text-right">Profile</h1>
                        </div>
                        <Form className="mt-5" >
                            <FormGroup className="my-3" controlId="firstname">
                                <FormLabel>First Name</FormLabel>
                                <FormControl type="text" name="firstname" value={FirstName} disabled={handleEdit()} onChange={(Event) => setFirstName(Event.target.value)} autoComplete="off"/>
                            </FormGroup>
                            <FormGroup md={12} className="my-3" controlId="lastname">
                                <FormLabel>Last Name</FormLabel>
                                <FormControl type="text" name="lastname" value={LastName} disabled={handleEdit()} onChange={(Event) => setLastName(Event.target.value)} autoComplete="off"/>
                            </FormGroup>
                            <FormGroup className="my-3" controlId="username">
                                <FormLabel>Username</FormLabel>
                                <FormControl type="text" name="username" value={Username} disabled />
                            </FormGroup>
                            <FormGroup className="my-3" controlId="email">
                                <FormLabel>Email</FormLabel>
                                <FormControl type="email" name="email" value={Email} disabled />
                            </FormGroup>
                            <FormGroup md={12} className="my-3" controlId="age">
                                <FormLabel>Age</FormLabel>
                                <FormControl type="text" name="age" value={Age} disabled={handleEdit()} onChange={(Event) => setAge(Event.target.value)} autoComplete="off"/>
                            </FormGroup>
                            <FormGroup md={12} className="my-3" controlId="contactnumber">
                                <FormLabel>Contact Number</FormLabel>
                                <FormControl type="tel" name="contactnumber" value={ContactNumber} disabled={handleEdit()} onChange={(Event) => setContactNumber(Event.target.value)} autoComplete="off"/>
                            </FormGroup>
                        </Form>
                        {Edit === "no" ? <EditProfileButton /> : <SaveProfileButton />}
                    </div>
                </Col>
            </Row>
        </Container >
    );
}


function ProfilePage() {
    return (

        <div>
            <NavigationBar />
            <Profile />
        </div>
    );
}

export default ProfilePage;