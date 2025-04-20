import React from 'react';
import { Link } from 'react-router-dom';

function Home({ connected, logoutMessage }) {
    return (
        <div className="home">
            <h1>Welcome to Digital Twin Management</h1>
            {logoutMessage && <p>{logoutMessage}</p>}
            {connected ? (
                <>
                    <p>You have Successfully Connected to the Metamask</p>
                    <Link to="/register" className="register-button">Please Register</Link>
                </>
            ) : (
                <p>Connect your MetaMask and register to start.</p>
                
            )}
        </div>
    );
}

export default Home;