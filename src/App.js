import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import DigitalTwinManagement from './DigitalTwinManagement.json';
import './App.css';

import Home from './components/Home';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import ApproverDashboard from './components/ApproverDashboard';

function App() {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
    const [connected, setConnected] = useState(false);
    const [logoutMessage, setLogoutMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const initWeb3 = async () => {
            if (window.ethereum) {
                try {
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const web3Instance = new Web3(window.ethereum);
                    setWeb3(web3Instance);
                    const accounts = await web3Instance.eth.getAccounts();
                    setAccounts(accounts);
                    setConnected(true);

                    const networkId = await web3Instance.eth.net.getId();
                    const deployedNetwork = DigitalTwinManagement.networks[networkId];
                    if (deployedNetwork) {
                        const contractInstance = new web3Instance.eth.Contract(
                            DigitalTwinManagement.abi,
                            deployedNetwork.address
                        );
                        setContract(contractInstance);
                    } else {
                        console.error('Contract not deployed on this network');
                    }
                } catch (error) {
                    console.error('User denied account access', error);
                }
            } else if (window.web3) {
                setWeb3(new Web3(window.web3.currentProvider));
                setConnected(true);
            } else {
                console.error('Non-Ethereum browser detected. You should consider trying MetaMask!');
            }
        };

        initWeb3();
    }, []);

    const handleLogout = async () => {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' }); // Re-request accounts to trigger MetaMask logout
            setConnected(false);
            setAccounts([]);
            setContract(null);
            setLogoutMessage('You have successfully logged out.');
            navigate('/');
        } catch (error) {
            console.error('Logout failed', error);
            setLogoutMessage('Logout failed.');
            navigate('/');
        }
    };

    return (
        <div className="App">
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    {connected && (
                        <>
                            <li className="account-display">Account: {accounts[0]}</li>
                            <li><button onClick={handleLogout}>Logout</button></li>
                        </>
                    )}
                </ul>
            </nav>
            <Routes>
                <Route path="/" element={<Home connected={connected} logoutMessage={logoutMessage} />} />
                <Route path="/register" element={<Register web3={web3} accounts={accounts} contract={contract} />} />
                <Route path="/user" element={<UserDashboard web3={web3} accounts={accounts} contract={contract} setLogoutMessage={setLogoutMessage} />} />
                <Route path="/approver" element={<ApproverDashboard web3={web3} accounts={accounts} contract={contract} setLogoutMessage={setLogoutMessage} />} />
            </Routes>
        </div>
    );
}

export default App;