import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import NavigationBar from "./NavigationBar";
import { AiFillDelete, AiFillEye } from 'react-icons/ai';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MySubGreddiits() {

    const [SubGreddiits, setSubGreddiits] = useState([]);
    const [changed, setChanged] = useState("no");
    const navigate = useNavigate();

    function NewSubGreddiit() {
        const [show, setShow] = useState(false);
        const [Name, setName] = useState("");
        const [Description, setDescription] = useState("");
        const [Tags, setTags] = useState("");
        const [BannedKeywords, setBannedKeywords] = useState("");

        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);

        function HandleSubmit(event) {
            console.log("submitted")
            event.preventDefault();

            axios.post("/api/newsubgreddiit", { Name, Description, Tags, BannedKeywords },
                { headers: { Authorization: localStorage.getItem('token') } }
            )
                .then(res => console.log(res))
                .catch(err => console.log(err));

            handleClose();
            setName("");
            setDescription("");
            setTags("");
            setBannedKeywords("");
            setChanged("yes");
        }

        return (
            <>
                <Button variant="primary" onClick={handleShow} className="my-5">
                    Create new SubGreddiit
                </Button>

                <Modal show={show} onHide={handleClose} style={{ "marginTop": "20vh" }} >
                    <Modal.Header closeButton>
                        <Modal.Title>New SubGreddiit</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" autoFocus onChange={(event) => setName(event.target.value)} value={Name} autoComplete="off" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" onChange={(event) => setDescription(event.target.value)} value={Description} autoComplete="off" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="tags">
                                <Form.Label>Tags</Form.Label>
                                <Form.Control type="text" onChange={(event) => setTags(event.target.value)} value={Tags} autoComplete="off" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="banned-keywords">
                                <Form.Label>Banned Keywords</Form.Label>
                                <Form.Control type="text" onChange={(event) => setBannedKeywords(event.target.value)} value={BannedKeywords} autoComplete="off" />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={HandleSubmit} type="submit" disabled={!(Name.length && Description.length && Tags.length && BannedKeywords.length)}>
                            Create
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    function SubGreddiitCard(props) {
        var sub_greddiit = props.sub_gred
        function HandleDelete() {
            console.log('clicked')
            axios.post("/api/deletesubgreddiit",
                { sub_greddiit },
                { headers: { Authorization: localStorage.getItem('token') } }
            )
                .then(res => console.log(res))
                .catch(err => console.log(err));

            setChanged("yes");
        }
        function HandleOpen() {
            console.log('clicked')
            navigate('/mysubgreddiit/' + sub_greddiit._id)
        }

        return (
            <>
                <Col md={4} className="my-3">
                    <Card>
                        {/* <Card.Img variant="top" src="holder.js/100px180?text=Image cap" /> */}
                        <Card.Body>
                            <Card.Title>
                                {sub_greddiit.name}
                                <div className="float-right">
                                </div>
                            </Card.Title>
                            <Card.Text>{sub_greddiit.description}</Card.Text>
                            <Card.Text>
                                <em>Number of Followers : </em>
                                {sub_greddiit.followers.length}
                                <br />
                                <em>Number of Posts : </em>
                                {sub_greddiit.posts}
                                <br />
                                <em>Banned Keywords : </em>
                                {sub_greddiit.bannedkeywords.join(', ')}
                                <br />
                                <AiFillDelete onClick={() => HandleDelete()} style={{ "cursor": "pointer" }} size="25px" className="mt-3 mx-1" />
                                <AiFillEye onClick={() => HandleOpen()} style={{ "cursor": "pointer" }} size="25px" className="mt-3 mx-1" />
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </>
        )
    }

    useEffect(() => {
        axios.get('/api/mysubgreddiits', { headers: { Authorization: localStorage.getItem('token') } })
            .then(res => {
                setSubGreddiits(res.data);
            })
        setChanged("no");
    }, [changed]);

    return (
        <Container className="text-center my-5">
            <h1  style={{"marginTop":"100px"}}>My SubGrreddiit</h1>
            <NewSubGreddiit />
            <Row>
                {React.Children.toArray(SubGreddiits.map((sub_gred) => <SubGreddiitCard sub_gred={sub_gred} />))}
            </Row>
        </Container>
    )
}

function MySubGredditsPage() {
    return (

        <div>
            <NavigationBar />
            <MySubGreddiits />
        </div>
    );
}

export default MySubGredditsPage;