'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ToastProvider = () => {
    return (
        <>
         <ToastContainer position="top-right" autoClose={2000} hideProgressBar theme="colored" />
        </>
    )
};
