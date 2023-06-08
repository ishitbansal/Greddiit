import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Nav, Navbar } from 'react-bootstrap'
import { CgProfile } from "react-icons/cg"
import { IoLogOutOutline } from "react-icons/io5"
import { AiOutlineHome, AiOutlineSave, AiOutlineProfile, AiOutlineGlobal } from "react-icons/ai"

// IoLogOutOutline

function NavigationBar() {

    const navigate = useNavigate();

    function handleClick() {
        console.log("clicked");
        localStorage.removeItem("token");
        navigate("/")

    }

    return (
        <div>
            <Navbar bg="primary" variant={"dark"} expand="lg" className="fixed-top"  >
                <Navbar.Brand href="#" className="mx-3">Greddiit </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar" />
                <Navbar.Collapse id="responsive-navbar">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/home"><AiOutlineHome size="25px" /> Home</Nav.Link>
                        <Nav.Link as={Link} to="/profile"><CgProfile size="25px" /> Profile</Nav.Link>
                        <Nav.Link as={Link} to="/subgreddiit"><AiOutlineGlobal size="25px" />SubGreddiit</Nav.Link>
                        <Nav.Link as={Link} to="/mysubgreddiit"><AiOutlineProfile size="25px" />MySubGreddiit</Nav.Link>
                        <Nav.Link as={Link} to="/savedposts"><AiOutlineSave size="25px" />SavedPosts</Nav.Link>
                        <Nav.Link onClick={handleClick}><IoLogOutOutline size="25px" /> Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

export default NavigationBar
