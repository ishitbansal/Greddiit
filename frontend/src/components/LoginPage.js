import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Form, Button, Row, Col } from 'react-bootstrap'
import axios from "axios";

function Header() {
    return (
        <header>
            <div className="Greddit">
                <Navbar bg="primary" variant={"dark"} expand="lg" >
                    <Navbar.Brand href="#" className="mx-3">Greddiit</Navbar.Brand>
                </Navbar>
            </div>
        </header>
    )
}

function Forms() {
    const [Login, setLogin] = useState("login");

    function LoginForm() {

        const [Email, setEmail] = useState("");
        const [Password, setPassword] = useState("");
        const navigate = useNavigate();


        function EnableSubmit() {
            return Email.length && Password.length;
        }

        function HandleSubmit(event) {
            event.preventDefault();
            axios.post("/api/login", { Email, Password })
                .then(res => {

                    res.data.token && localStorage.setItem("token", res.data.token);
                    res.data.token ? navigate("/home") : window.alert("wrong credentials");

                    !res.data.token && setEmail("")
                    !res.data.token && setPassword("")

                    // console.log(localStorage.getItem("token"));

                })
                .catch(err => console.log(err));


        }

        return (
            <Container className="mt-5" style={{ "maxWidth": "500px" }}>
                <h1> Login </h1>
                <Form className=" px-5 mx-auto" onSubmit={HandleSubmit} style={{ "marginTop": "10vh" }}>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Control type="text" name="email" placeholder="Email" onChange={(event) => setEmail(event.target.value)} value={Email} autoComplete="off" />
                    </Form.Group>
                    <Form.Group className="mb-5" controlId="password">
                        <Form.Control type="password" name="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} value={Password} autoComplete="off" />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mb-3" disabled={!EnableSubmit()} style={{ "opacity": EnableSubmit() ? "100%" : "70%", "cursor": EnableSubmit() ? "pointer" : "not-allowed" }}>
                        Login
                    </Button>
                </Form>
            </Container>

        );
    }


    function RegistrationForm() {
        const [FirstName, setFirstName] = useState("");
        const [LastName, setLastName] = useState("");
        const [Username, setUsername] = useState("");
        const [Email, setEmail] = useState("");
        const [Age, setAge] = useState("");
        const [ContactNumber, setContactNumber] = useState("");
        const [Password, setPassword] = useState("");

        function EnableSubmit() {
            return FirstName.length && LastName.length && Username.length && Email.length && Age.length && ContactNumber.length && Password.length;
        }

        function HandleSubmit(event) {
            event.preventDefault();

            axios.post("/api/register", { FirstName, LastName, Username, Email, Age, ContactNumber, Password })
                .then(res => {
                    console.log(res)
                    res.data === 'Email already registered' && window.alert('Email already registered') && setLogin('register')
                })
                .catch(err => console.log(err));
            setFirstName("")
            setLastName("")
            setUsername("")
            setEmail("")
            setAge("")
            setContactNumber("")
            setPassword("")
            setLogin("login")

        }

        return (
            <Container style={{ "maxWidth": "500px" }}>
                <h1 className="mb-5"> Register </h1>

                <Form className=" px-5 mx-auto" onSubmit={HandleSubmit}>
                    <Row>
                        <Col>
                            <Form.Group className="mb-2" controlId="firstname">
                                <Form.Control type="text" name="firstname" maxlength="20" placeholder="First Name" onChange={(event) => setFirstName(event.target.value)} value={FirstName} autoComplete="off" />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-2" controlId="lastname">
                                <Form.Control type="text" name="lastname" maxlength="20" placeholder="Last Name" onChange={(event) => setLastName(event.target.value)} value={LastName} autoComplete="off" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Form.Group className="mb-2" controlId="username">
                            <Form.Control type="text" name="username" maxlength="20" placeholder="Username" onChange={(event) => setUsername(event.target.value)} value={Username} autoComplete="off" />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="mb-2" controlId="email">
                            <Form.Control type="email" name="email" placeholder="Email" onChange={(event) => setEmail(event.target.value)} value={Email} autoComplete="off" />
                        </Form.Group>
                    </Row><Row>
                        <Form.Group className="mb-2" controlId="age">
                            <Form.Control type="number" min="15" max="100" name="age" placeholder="Age" onChange={(event) => setAge(event.target.value)} value={Age} autoComplete="off" />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="mb-2" controlId="contactnumber">
                            <Form.Control type="tel" pattern="[1-9]{1}[0-9]{9}" name="contactnumber" placeholder="Contact Number" onChange={(event) => setContactNumber(event.target.value)} value={ContactNumber} autoComplete="off" />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="mb-4" controlId="password">
                            <Form.Control type="password" name="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} value={Password} autoComplete="off" />
                        </Form.Group>
                    </Row>
                    <Button type="submit" className="mb-3" disabled={!EnableSubmit()} autoComplete="off" style={{ opacity: EnableSubmit() ? "100%" : "60%", cursor: EnableSubmit() ? "pointer" : "not-allowed" }} >
                        Register
                    </Button>
                </Form>
            </Container>
        );
    }

    return (
        <div className="text-center" style={{ "marginTop": "20vh" }}>
            {Login === "login" ? <LoginForm /> : <RegistrationForm />}
            {Login === "login" ? <p>Don't have an account ? <span onClick={() => setLogin("register")} style={{ "cursor": "pointer", "color": "blue" }}><strong>Register here</strong></span></p> : <p>Already have an account ? <span onClick={() => setLogin("login")} style={{ "cursor": "pointer", "color": "blue" }}><strong>Login here</strong></span></p>}
        </div>
    )
}

function LoginPage() {
    return (
        <div>
            <Header />
            <Forms />
        </div>
    );
}

export default LoginPage