import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload';
import FileList from './FileList';
import UpdateFileHash from './UpdateFileHash';
import RequestConsent from './RequestConsent'; // Import RequestConsent
import { useNavigate } from 'react-router-dom';

function UserDashboard({ web3, accounts, contract, setLogoutMessage }) {
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFiles = async () => {
            if (!contract) return;
            try {
                const fileCount = await contract.methods.fileCount().call();
                const fetchedFiles = [];
                for (let i = 1; i <= fileCount; i++) {
                    const file = await contract.methods.files(i).call();
                    fetchedFiles.push(file);
                }
                setFiles(fetchedFiles);
            } catch (error) {
                console.error("Error fetching files:", error);
            }
        };
        fetchFiles();
    }, [contract]);

    const handleLogout = () => {
        setLogoutMessage("You have successfully logged out from User Dashboard.");
        navigate('/');
    };

    return (
        <div className="user-dashboard">
            <h2>User Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
            <FileUpload web3={web3} accounts={accounts} contract={contract} />
            <FileList files={files} />
            <UpdateFileHash web3={web3} accounts={accounts} contract={contract} files={files} />
            <RequestConsent web3={web3} accounts={accounts} contract={contract} files={files}/>
        </div>
    );
}

export default UserDashboard;