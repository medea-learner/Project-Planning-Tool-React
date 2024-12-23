import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../redux/actions/authActions';
import { useSelector } from "react-redux";

const Navbar = () => {
    const dispatch = useDispatch(); 
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/login");
    };

    
    return (
        <nav className="sticky top-0 left-0 py-6 px-6 flex justify-between items-center border-b border-gray-200 shadow-sm bg-slate-50">
            <Link to="/" className="text-xl font-semibold drop-shadow-lg">
                Project Planning Tool
            </Link>

            <div className="space-x-6">
                {isAuthenticated ? (
                    <>
                        <Link
                            to="/projects/new"
                            className="text-lg font-semibold text-green-800 hover:text-gray-500 drop-shadow-md"
                        >
                            New Project
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-5 py-2 text-lg font-semibold border border-teal-500 rounded-xl hover:border-teal-700 hover:shadow-md hover:text-gray-500"
                        >
                            Logout
                        </button>
                        <Link
                            to="/"
                            className="px-5 py-3 text-lg font-semibold border border-gray-500 rounded-xl hover:border-gray-700 hover:shadow-md hover:text-gray-500"
                        >
                            Dashboard
                        </Link>
                    </>
                ) : (
                    <>
                        <Link
                            to="/signup"
                            className="px-6 py-3 text-lg font-semibold border border-teal-500 rounded-xl hover:border-teal-700 hover:shadow-sm hover:shadow-teal-500"
                        >
                            Sign up
                        </Link>
                        <Link
                            to="/login"
                            className="px-6 py-3 text-lg font-semibold border border-gray-500 rounded-xl hover:border-gray-700 hover:shadow-sm hover:shadow-gray-500"
                        >
                            Log in
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
