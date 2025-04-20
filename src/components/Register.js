import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register({ web3, accounts, contract }) {
    const [userType, setUserType] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!web3 || !accounts || !contract) return;
        try {
            if (userType === 'user') {
                await contract.methods.registerUser(address).send({ from: accounts[0] });
                alert('User registered successfully');
                navigate('/user');
            } else if (userType === 'approver') {
                await contract.methods.registerApprover(address).send({ from: accounts[0] });
                alert('Approver registered successfully');
                navigate('/approver');
            }
        } catch (error) {
            console.error('Registration failed', error);
            alert('Registration failed');
        }
    };

    return (
        <div className="register">
            <h2>Register</h2>
            <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                <option value="">Select User Type</option>
                <option value="user">User</option>
                <option value="approver">Approver</option>
            </select>
            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            <button onClick={handleRegister}>Register</button>
        </div>
    );
}

export default Register;