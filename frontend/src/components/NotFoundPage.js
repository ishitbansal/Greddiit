import React from "react";
import { Container } from 'react-bootstrap'
import NavigationBar from "./NavigationBar";

function NotFoundPage() {

    return (
        <>
            <NavigationBar />
            <Container className="text-center" style={{ "marginTop": "100px" }}>
                <h1> 404 Page Not Found </h1>
            </Container>
        </>
    )
}

export default NotFoundPage;