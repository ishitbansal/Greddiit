import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoutes = ({ children }) => {
    // if (localStorage.getItem('logged-in') === 'yes') {
    //     return children;
    // }
    if (localStorage.getItem('token')) {
        return children;
    }
    return <Navigate to='/' replace />
}

export default ProtectedRoutes;