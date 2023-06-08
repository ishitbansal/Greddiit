import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ListGroup } from 'react-bootstrap';
import axios from "axios";

function FollowersModal() {

    const [followers, setFollowers] = useState([]);
    const [Removed, setRemoved] = useState("no");

    useEffect(() => {
        axios.get('/api/profile', { headers: { Authorization: localStorage.getItem('token') } })
            .then(res => {
                setFollowers(res.data.followers);
                // console.log(followers);
                // console.log(followers.length);
            })
        setRemoved("no");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Removed]);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function HandleClick(follower) {
        // console.log('clicked');
        console.log(follower);
        axios.post("/api/removefollower",
            { follower },
            { headers: { Authorization: localStorage.getItem('token') } }
        )
            .then(res => console.log(res))
            .catch(err => console.log(err));
        setRemoved("yes");
    }

    return (
        <>
            <Button variant="outline-primary" onClick={handleShow}>
                {followers.length} Followers
            </Button>

            <Modal show={show} onHide={handleClose} centered scrollable style={{ "maxHeight": "50vh", "marginTop": "25vh " }}>
                <Modal.Header closeButton>
                    <Modal.Title>Followers</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        {React.Children.toArray(followers.map((follower) => <ListGroup.Item>{follower} <Button style={{ float: 'right' }} onClick={() => HandleClick(follower)}
                        >Remove</Button></ListGroup.Item>))}
                    </ListGroup>
                </Modal.Body>
            </Modal>


        </>
    );
}

function FollowingModal() {

    const [following, setFollowing] = useState([]);
    const [Removed, setRemoved] = useState("no");

    useEffect(() => {
        axios.get('/api/profile', { headers: { Authorization: localStorage.getItem('token') } })
            .then(res => {
                setFollowing(res.data.following);
                // console.log(following);
                // console.log(following.length);
            })
        setRemoved("no");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Removed]);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function HandleClick(following) {
        // console.log('clicked');
        console.log(following);
        axios.post("/api/unfollow",
            { following },
            { headers: { Authorization: localStorage.getItem('token') } }
        )
            .then(res => console.log(res))
            .catch(err => console.log(err));
        setRemoved("yes");
    }

    return (
        <>
            <Button variant="outline-primary" onClick={handleShow}>
                {following.length} Following
            </Button>
            <Modal show={show} onHide={handleClose} centered scrollable style={{ "maxHeight": "50vh", "marginTop": "25vh " }}>
                <Modal.Header closeButton>
                    <Modal.Title>Following</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        {React.Children.toArray(following.map((following) => <ListGroup.Item>{following} <Button style={{ float: 'right' }} onClick={() => HandleClick(following)}>
                            Unfollow</Button></ListGroup.Item>))}
                    </ListGroup>
                </Modal.Body>
            </Modal>
        </>
    );
}

export { FollowersModal, FollowingModal };