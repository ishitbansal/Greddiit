import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap'
import Card from 'react-bootstrap/Card';
import NavigationBar from "./NavigationBar";
import { AiOutlineSortAscending, AiOutlineSortDescending } from 'react-icons/ai';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import Fuse from 'fuse.js'



function SubGreddiits() {

    const [SubGreddiits, setSubGreddiits] = useState([]);
    const [User, setUser] = useState("");
    const [Modified, setModified] = useState("no");
    const [SearchText, setSearchText] = useState("");
    const [Sort, setSort] = useState("none");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/subgreddiits', { headers: { Authorization: localStorage.getItem('token') } })
            .then(res => {
                setSubGreddiits(res.data);
            })
        setModified("no");
    }, [Modified]);

    useEffect(() => {
        axios.get('/api/profile', { headers: { Authorization: localStorage.getItem('token') } })
            .then(res => {
                setUser(res.data.username);
            })

    }, []);

    function sortSubGreddiits() {
        var sorted = SubGreddiits;
        Sort === 'name-asc' && sorted.sort((a, b) => a.name < b.name ? -1 : 1)
        Sort === 'name-desc' && sorted.sort((a, b) => a.name < b.name ? 1 : -1)
        Sort === 'followers' && sorted.sort((a, b) => a.followers.length < b.followers.length ? 1 : -1)
        Sort === 'creationdate' && sorted.sort((a, b) => a.creationdate < b.creationdate ? 1 : -1)
        return sorted;
    }

    function filterSubGreddiits(sub_gred) {
        return selectedOptions.length === 0 || selectedOptions.some(obj => sub_gred.tags.some(t => t === obj.value));

    }

    // Fuzzy Search
    function searchFuzzySubGreddiit(sortedSubgreddiit) {
        if (SearchText === '') return SubGreddiits
        const fuse = new Fuse(sortedSubgreddiit, { keys: ["name"], shouldSort: false, includeMatches: true });
        const pattern = SearchText
        var searchSubGred = []
        fuse.search(pattern).forEach(element => searchSubGred.push(element.item))
        return searchSubGred
    }

    // Normal Search :
    // function searchSubGreddiit(sub_gred) {
    //     return sub_gred.name.toLowerCase().includes(SearchText.toLowerCase());
    // }

    function SubGreddiitCard(sub_greddiit) {

        function HandleOpen() {
            console.log('clicked')
            navigate('/subgreddiit/' + sub_greddiit._id)
        }

        function checkModerator() {
            return User === sub_greddiit.moderator;
        }

        function HandleJoin() {
            axios.post("/api/joinrequest",
                { subgred_id: sub_greddiit._id },
                { headers: { Authorization: localStorage.getItem('token') } }
            )
                .then(res => {
                    console.log(res)
                    res.data === 'left' && window.alert('left this subgreddiit');
                    res.data === 'rejected' && window.alert('join request rejected in this subgreddiit');
                    res.data === 'requested' && window.alert('join request already sent before');
                    res.data === 'blocked' && window.alert('blocked from this subgreddit');
                })
                .catch(err => console.log(err));
            setModified("yes");
        }

        function HandleLeave() {
            axios.post("/api/leavesubgreddiit",
                { subgred_id: sub_greddiit._id },
                { headers: { Authorization: localStorage.getItem('token') } }
            )
                .then(res => {
                    console.log(res)
                })
                .catch(err => console.log(err));
            setModified("yes");
        }

        return (
            <>
                <Card className="my-2">
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
                            <br /><br />
                            {(sub_greddiit.followers.includes(User)) ? <Button disabled={checkModerator()} onClick={HandleLeave}>Leave</Button> : <Button onClick={HandleJoin}>Join</Button>}
                            {(sub_greddiit.followers.includes(User)) && <Button onClick={HandleOpen} >Open</Button>}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </>
        )
    }

    const [selectedOptions, setSelectedOptions] = useState([]);

    function handleSelect(data) {
        setSelectedOptions(data);
    }

    var options = []
    SubGreddiits.map((sub_gred) => sub_gred.tags.map((tag) => options.push({ value: tag, label: tag })))

    return (
        <Container className="text-center my-5">
            <h1 style={{ "marginTop": "100px", "marginBottom": "50px" }}>SubGreddiit</h1>
            <Form className="my-3"  >
                <Row>
                    <Col md={5}>
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            onChange={(event) => setSearchText(event.target.value)} value={SearchText} autoComplete="off"
                        />
                    </Col>
                    <Col md={5}>
                        <Select options={[...new Set(options)]}
                            value={selectedOptions}
                            onChange={handleSelect}
                            isMulti
                            isSearchable={true}
                            placeholder="Filter"
                        />
                    </Col>
                    <Col md={2}>
                        <DropdownButton
                            title="Sort">
                            <Dropdown.Item onClick={() => setSort("none")} active={Sort === 'none'} >None</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSort("name-asc")} active={Sort === 'name-asc'}>Name<AiOutlineSortAscending /></Dropdown.Item>
                            <Dropdown.Item onClick={() => setSort("name-desc")} active={Sort === 'name-desc'}>Name<AiOutlineSortDescending /></Dropdown.Item>
                            <Dropdown.Item onClick={() => setSort("followers")} active={Sort === 'followers'}>Followers</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSort("creationdate")} active={Sort === 'creationdate'}>Creation Date</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                </Row>

            </Form>

            <Row>

                {Sort === 'none' && React.Children.toArray(searchFuzzySubGreddiit(SubGreddiits).map((sub_gred) =>
                    sub_gred.followers.includes(User) &&
                    filterSubGreddiits(sub_gred) &&
                    SubGreddiitCard(sub_gred)))}

                {Sort === 'none' && React.Children.toArray(searchFuzzySubGreddiit(SubGreddiits).map((sub_gred) =>
                    !sub_gred.followers.includes(User) &&
                    filterSubGreddiits(sub_gred) &&
                    SubGreddiitCard(sub_gred)))}

                {Sort !== 'none' && React.Children.toArray(searchFuzzySubGreddiit(sortSubGreddiits()).map((sub_gred) =>
                    filterSubGreddiits(sub_gred) &&
                    SubGreddiitCard(sub_gred)))}

                {/* Normal Search */}
                {/* {Sort === 'none' && React.Children.toArray(SubGreddiits.map((sub_gred) =>
                    sub_gred.followers.includes(User) &&
                    searchSubGreddiit(sub_gred) &&
                    filterSubGreddiits(sub_gred) &&
                    SubGreddiitCard(sub_gred)))}

                {Sort === 'none' && React.Children.toArray(SubGreddiits.map((sub_gred) =>
                    !sub_gred.followers.includes(User) &&
                    searchSubGreddiit(sub_gred) &&
                    filterSubGreddiits(sub_gred) &&
                    SubGreddiitCard(sub_gred)))}

                {Sort !== 'none' && React.Children.toArray(sortSubGreddiits().map((sub_gred) =>
                    searchSubGreddiit(sub_gred) &&
                    filterSubGreddiits(sub_gred) &&
                    SubGreddiitCard(sub_gred)))} */}

            </Row>
        </Container >)
}

function SubGredditsPage() {
    return (

        <div>
            <NavigationBar />
            <SubGreddiits />
        </div>
    );
}

export default SubGredditsPage;