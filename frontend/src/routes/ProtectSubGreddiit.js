import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NotFoundPage from "../components/NotFoundPage";

const ProtectSubGreddiit = ({ children }) => {

    const [Allow, setAllow] = useState(false)
    const { subgred_id } = useParams();

    useEffect(() => {
        axios.get('/api/protectsubgreddiit', { headers: { Authorization: localStorage.getItem('token') }, params: { id: subgred_id } })
            .then(res => {
                setAllow(res.data)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (Allow) {
        return children;
    }
    else {
        return <NotFoundPage />
    }
}

export default ProtectSubGreddiit;