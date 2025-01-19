import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleViewClick = () => {
        navigate('/View');
    };

    const handleHostClick = () => {
        navigate('/Host');
    };

    return (
        <>
            <div className="banner">
                <h1>Out&About</h1>
            </div>
            
            <h2 id="question">What would you like to do?</h2>

            <button 
                id="view" 
                onClick={handleViewClick}
                className="nav-button"
            >
                View Activities
            </button>

            <button 
                id="host" 
                onClick={handleHostClick}
                className="nav-button"
            >
                Host Activities
            </button>
        </>
    );
};

export default Home;