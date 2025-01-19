import React from 'react'
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <>
            <div className="banner">
                <h1>Out&About</h1>

            </div>
            <h2 id="question">What would you like to do?</h2>

            <div id="view"> {<Link to={"/View"}>View Activities</Link>} </div>
            <div id="host"> {<Link to={"/Host"}>Host Activities</Link>} </div>

            

        </>

    )
}

export default Home
