import React from 'react'
import { Navigate } from 'react-router-dom'

const PersistentLogin = ({ children }) => {
    // if (localStorage.getItem('logged-in') === 'yes') {
    //     return <Navigate to='/profile' replace />
    // }
    if (localStorage.getItem('token')) {
        return <Navigate to='/profile' replace />
    }
    return children;
}

export default PersistentLogin;