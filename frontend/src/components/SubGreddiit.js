import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Col, Container, Row, Form, Modal, Card, InputGroup, ListGroupItem } from 'react-bootstrap'
import NavigationBar from "./NavigationBar";
import SubGredImg from "../assets/lake.jpeg";
import Image from 'react-bootstrap/Image'
import axios from "axios";
import { SlUserFollow, SlUserFollowing } from "react-icons/sl";
import { BiCommentAdd } from "react-icons/bi";
import { GoReport } from "react-icons/go"
import { FaLongArrowAltUp, FaLongArrowAltDown } from "react-icons/fa"
import { BsFillBookmarkFill } from "react-icons/bs"




function Func() {

    const [Modified, setModified] = useState("no");
    const [Posts, setPosts] = useState([]);
    const { subgred_id } = useParams();
    const [SubGredInfo, setSubGredInfo] = useState({})
    const [User, setUser] = useState("");
    const [UserFollowing, setUserFollowing] = useState([]);
    const [Followed, setFollowed] = useState("no");

    useEffect(() => {
        axios.get('/api/profile', { headers: { Authorization: localStorage.getItem('token') } })
            .then(res => {
                setUser(res.data.username);
                setUserFollowing(res.data.following);
            })
        setFollowed("no");

    }, [Followed]);

    useEffect(() => {
        axios.get('/api/subgreddiit', { headers: { Authorization: localStorage.getItem('token') }, params: { id: subgred_id } })
            .then(res => {
                setSubGredInfo(res.data)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        axios.get('/api/posts', { headers: { Authorization: localStorage.getItem('token') }, params: { id: subgred_id } })
            .then(res => {
                setPosts(res.data);
            })
        setModified("no");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Modified]);

    function CreatePost() {
        const [show, setShow] = useState(false);
        const [PostText, setPostText] = useState("");

        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);

        function HandleSubmit(event) {
            console.log('clicked')
            event.preventDefault();

            SubGredInfo.bannedkeywords.some((keyword) => PostText.toLowerCase().includes(keyword.toLowerCase()))
                && window.alert("Post Text includes keywords that are banned in this subgreddiit, they will be replaced by *")

            axios.post("/api/newpost", { subgred_id, PostText },
                { headers: { Authorization: localStorage.getItem('token') } }
            )
                .then(res => {
                    setPostText("");
                    setModified("yes");
                    console.log(res)
                })
                .catch(err => console.log(err));

            handleClose();

        }

        return (
            <>
                <Button variant="primary" onClick={handleShow}>
                    Create Post
                </Button>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="post-text">
                                <Form.Label>Text</Form.Label>
                                <Form.Control as="textarea" rows={3} onChange={(event) => setPostText(event.target.value)} value={PostText} autoComplete="off" autoFocus />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={HandleSubmit} disabled={PostText.length === 0}>
                            Post
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    function PostCard(props) {
        var post = props.post;
        const [Comment, setComment] = useState("")

        function Upvote() {
            axios.post("/api/upvotepost",
                { id: post._id },
                { headers: { Authorization: localStorage.getItem('token') } }
            )
                .then(res => {
                    setModified("yes");
                    console.log(res)
                })
                .catch(err => console.log(err));
        }

        function Downvote() {
            axios.post("/api/downvotepost",
                { id: post._id },
                { headers: { Authorization: localStorage.getItem('token') } }
            )
                .then(res => {
                    setModified("yes");
                    console.log(res)
                })
                .catch(err => console.log(err));
        }

        function AddComment() {
            axios.post("/api/addcomment",
                { id: post._id, text: Comment },
                { headers: { Authorization: localStorage.getItem('token') } }
            )
                .then(res => {
                    setModified("yes");
                    setComment("")
                    console.log(res)
                })
                .catch(err => console.log(err));
        }

        function WriteComment(props) {
            var comment = props.comment
            return <>
                <ListGroupItem>
                    {comment.text}
                    <div style={{ "float": "right" }}>
                        - {comment.author}
                    </div>
                </ListGroupItem>
            </>
        }

        function SavePost() {
            axios.post("/api/savepost",
                { id: post._id },
                { headers: { Authorization: localStorage.getItem('token') } }
            )
                .then(res => {
                    res.data === "already saved" && window.alert("Post is already saved")
                    setModified("yes");
                    console.log(res)
                })
                .catch(err => console.log(err));
        }

        function FollowUser() {
            axios.post("/api/followuser",
                { user: post.postedby },
                { headers: { Authorization: localStorage.getItem('token') } }
            )
                .then(res => {
                    setFollowed("yes");
                    console.log(res)

                })
                .catch(err => console.log(err));

        }

        function ReportModal() {
            const [show, setShow] = useState(false);
            const [Concern, setConcern] = useState("")

            const handleClose = () => setShow(false);
            const handleShow = () => setShow(true);

            function ReportPost() {
                axios.post("/api/reportpost",
                    { id: post._id, concern: Concern },
                    { headers: { Authorization: localStorage.getItem('token') } }
                )
                    .then(res => {
                        setModified("yes");
                        console.log(res)
                    })
                    .catch(err => console.log(err));

                handleShow()
            }

            return (
                <>
                    <GoReport className="" size="25px" style={{ "color": post.reportedby.includes(User) && "blue", "cursor": "pointer" }} onClick={() => post.reportedby.includes(User) ? window.alert('Post is already reported') : handleShow()} />

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Report</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Concern</Form.Label>
                                    <Form.Control as="textarea" rows={3} onChange={(Event) => setConcern(Event.target.value)} value={Concern} autoFocus autoComplete="off" />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={ReportPost} disabled={!Concern.length}>
                                Report
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            );
        }

        return (
            <>
                <Card className="text-left">
                    <Card.Body>
                        <blockquote className="blockquote mb-0">
                            <p>{post.text}</p>
                            <footer className="blockquote-footer">
                                {post.postedby}
                                {post.postedby !== "Blocked User" && User !== post.postedby && !UserFollowing.includes(post.postedby) && <SlUserFollow className="mx-3" size="20px" onClick={FollowUser} style={{ "cursor": "pointer" }} />}
                                {post.postedby !== "Blocked User" && User !== post.postedby && UserFollowing.includes(post.postedby) && <SlUserFollowing className="mx-3" size="20px" onClick={() => window.alert("Already Following")} style={{ "color": "blue", "cursor": "pointer" }} />}
                            </footer>
                        </blockquote>
                        <br />
                        <FaLongArrowAltUp className="" size="25px" style={{ "color": post.upvotes.includes(User) && "blue", "cursor": "pointer" }} onClick={Upvote} />
                        <FaLongArrowAltDown className="" size="25px" style={{ "color": post.downvotes.includes(User) && "blue", "cursor": "pointer" }} onClick={Downvote} />
                        <div style={{ "float": "right" }}>
                            <BsFillBookmarkFill className="mx-3" size="25px" style={{ "color": post.savedby.includes(User) && "blue", "cursor": "pointer" }} onClick={SavePost} />
                            <ReportModal></ReportModal>
                        </div>
                        <br />
                    </Card.Body>
                    <Card.Body >
                        Comments<br />
                        <Form>
                            <InputGroup className="my-1">
                                <Form.Control placeholder="Write Comment" name="text" autoComplete="off" value={Comment} onChange={(event) => setComment(event.target.value)} />
                                <Button onClick={AddComment} disabled={!Comment.length} >
                                    <BiCommentAdd size="30px" className="mx-2" />
                                </Button>
                            </InputGroup>
                        </Form>
                        <div style={{ "maxHeight": "100px", "overflowY": "scroll" }}>
                            {React.Children.toArray(post.comments.slice(0).reverse().map((comment) => <WriteComment comment={comment} />))}
                        </div>
                    </Card.Body>
                </Card>
                <br />
            </>

        );
    }


    return (
        <Container style={{ "marginTop": "100px" }} >
            <Row className="my-5 ">
                <Col md={4}>
                    <div className="sticky-md-top text-center ">
                        <Image src={SubGredImg} alt="profile-img" style={{ height: "250px", width: "250px" }} className="my-5" roundedCircle />
                        <br />
                        <h2 className="my-3">{SubGredInfo.name}</h2>
                        <p>{SubGredInfo.description}</p>
                    </div>
                </Col>
                <Col md={8}>
                    <CreatePost />
                    <br /><br /><br />
                    {React.Children.toArray(Posts.map((post) => <PostCard post={post} />))}
                </Col>
            </Row>
        </Container>
    )
}




function SubGreddiit() {
    return (
        <>
            <NavigationBar />
            <Func />
        </>
    )
}

export default SubGreddiit;