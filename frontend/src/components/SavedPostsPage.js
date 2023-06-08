import React, { useState, useEffect } from "react";
import { Button, Container, Form, Card, InputGroup, ListGroupItem } from 'react-bootstrap'
import NavigationBar from "./NavigationBar";
import axios from "axios";
import { SlUserFollow, SlUserFollowing } from "react-icons/sl";
import { BiCommentAdd } from "react-icons/bi";
import { GoReport } from "react-icons/go"
import { FaLongArrowAltUp, FaLongArrowAltDown } from "react-icons/fa"
import { BsFillBookmarkXFill } from "react-icons/bs"

function Func() {
    const [SubGreddiits, setSubGreddiits] = useState([]);
    const [Modified, setModified] = useState("no");
    const [Posts, setPosts] = useState([]);
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
        axios.get('/api/subgreddiits', { headers: { Authorization: localStorage.getItem('token') } })
            .then(res => {
                setSubGreddiits(res.data);
            })
        setModified("no");
    }, []);

    useEffect(() => {
        axios.get('/api/savedposts', { headers: { Authorization: localStorage.getItem('token') } })
            .then(res => {
                setPosts(res.data);
            })
        setModified("no");
    }, [Modified]);




    function PostCard(props) {
        var post = props.post
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

        function UnsavePost() {
            axios.post("/api/unsavepost",
                { id: post._id },
                { headers: { Authorization: localStorage.getItem('token') } }
            )
                .then(res => {
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

        function ReportPost() {
            axios.post("/api/reportpost",
                { id: post._id },
                { headers: { Authorization: localStorage.getItem('token') } }
            )
                .then(res => {
                    setModified("yes");
                    console.log(res)
                })
                .catch(err => console.log(err));
        }

        return (
            <>
                <Card className="text-left">
                    <Card.Body>
                        <blockquote className="blockquote mb-0">
                            <p>{post.text}</p>
                            <footer className="blockquote-footer">
                                {post.postedby}
                                {User !== post.postedby && !UserFollowing.includes(post.postedby) && <SlUserFollow className="mx-3" size="20px" onClick={FollowUser} style={{ "cursor": "pointer" }} />}
                                {User !== post.postedby && UserFollowing.includes(post.postedby) && <SlUserFollowing className="mx-3" size="20px" onClick={() => window.alert("Already Following")} style={{ "color": "blue", "cursor": "pointer" }} />}
                                <br />
                                {SubGreddiits.length && (SubGreddiits.find((sub_gred) => sub_gred._id === post.postedin)).name}
                            </footer>
                        </blockquote>
                        <br />

                        <FaLongArrowAltUp className="" size="25px" style={{ "color": post.upvotes.includes(User) && "blue", "cursor": "pointer" }} onClick={Upvote} />
                        <FaLongArrowAltDown className="" size="25px" style={{ "color": post.downvotes.includes(User) && "blue", "cursor": "pointer" }} onClick={Downvote} />
                        <div style={{ "float": "right" }}>
                            <BsFillBookmarkXFill className="mx-3" size="25px" style={{ "cursor": "pointer" }} onClick={UnsavePost} />
                            <GoReport className="" size="25px" style={{ "cursor": "pointer" }} onClick={ReportPost} />
                        </div>
                        <br />

                    </Card.Body>
                    <Card.Body >
                        Comments<br />
                        <Form onSubmit={AddComment}>
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
        <Container>
            <h1 className="text-center" style={{"marginTop":"100px","marginBottom":"50px"}}>Saved Posts</h1>
            {React.Children.toArray(Posts.map((post) => { return <PostCard post={post} /> }))}
        </Container>
    )
}

function SavedPosts() {
    return (
        <>
            <NavigationBar />
            <Func />
        </>
    )
}

export default SavedPosts;