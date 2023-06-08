import React, { useState, useEffect } from "react";
import { Container } from 'react-bootstrap'
import NavigationBar from "./NavigationBar"
import axios from "axios";

function HomePage() {

    const [Username, setUsername] = useState("");

    useEffect(() => {
        axios.get('/api/profile', { headers: { Authorization: localStorage.getItem('token') } })
            .then(res => {
                setUsername(res.data.username);
            })
    }, []);

    return (
        <>
            <NavigationBar />
            <Container className="text-center" style={{ "marginTop": "100px" }}>
                <h1> Welcome {Username} to Greddit </h1>
            </Container>
        </>
    )
}

export default HomePage;