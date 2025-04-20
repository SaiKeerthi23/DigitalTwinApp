import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ApproverDashboard({ web3, accounts, contract, setLogoutMessage }) {
    const [updateRequests, setUpdateRequests] = useState([]);
    const [consentRequests, setConsentRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUpdateRequests = async () => {
            if (!contract) return;
            try {
                const fileCount = await contract.methods.fileCount().call();
                const fetchedRequests = [];
                for (let i = 1; i <= fileCount; i++) {
                    try {
                        const request = await contract.methods.updateRequests(i).call();
                        if (request.fileId !== "0" && !request.isApproved && request.newIpfsHash) {
                            fetchedRequests.push(request);
                        }
                    } catch (error) {
                        console.error("Error fetching update requests:", error);
                    }
                }
                setUpdateRequests(fetchedRequests);
            } catch (error) {
                console.error("Error fetching update requests:", error);
            }
        };
        fetchUpdateRequests();

        const fetchConsentRequests = async () => {
            if (!contract) return;
            try {
                const fileCount = await contract.methods.fileCount().call();
                const fetchedRequests = [];
                for (let i = 1; i <= fileCount; i++) {
                    try {
                        const request = await contract.methods.consentRequests(i).call();
                        if (request.fileId !== "0" && !request.isFinalized) {
                            fetchedRequests.push(request);
                        }
                    } catch (error) {
                        console.error("Error fetching consent requests:", error);
                    }
                }
                setConsentRequests(fetchedRequests);
            } catch (error) {
                console.error("Error fetching consent requests:", error);
            }
        };
        fetchConsentRequests();
    }, [contract]);

    const handleApproveUpdate = async (fileId) => {
        if (!web3 || !accounts || !contract) return;
        try {
            console.log("Approving update for file ID:", fileId, accounts[0]);
            const result = await contract.methods.approveUpdate(fileId).send({ from: accounts[0], gas: 500000 });
            console.log("Approval result:", result);
            alert('Update request approved');
            setUpdateRequests(updateRequests.filter(req => Number(req.fileId) !== Number(fileId)));
        } catch (error) {
            console.error("Approval failed:", error);
            alert("Approval failed.");
        }
    };

    const handleApproveConsent = async (fileId) => {
        if (!web3 || !accounts || !contract) return;
        try {
            await contract.methods.approveConsent(fileId).send({ from: accounts[0], gas: 300000 });
            alert('Consent request approved');
            setConsentRequests(consentRequests.filter(req => Number(req.fileId) !== Number(fileId)));
        } catch (error) {
            console.error("Approval failed:", error);
            alert("Approval failed.");
        }
    };

    const handleRejectConsent = async (fileId) => {
        if (!web3 || !accounts || !contract) return;
        try {
            await contract.methods.rejectConsent(fileId).send({ from: accounts[0], gas: 300000 });
            alert('Consent request rejected');
            setConsentRequests(consentRequests.filter(req => Number(req.fileId) !== Number(fileId)));
        } catch (error) {
            console.error("Rejection failed:", error);
            alert("Rejection failed.");
        }
    };

    const handleLogout = () => {
        setLogoutMessage("You have successfully logged out from Approver Dashboard.");
        navigate('/');
    };

    return (
        <div className="approver-dashboard">
            <h2>Approver Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
            <h3>Pending Update Requests</h3>
            <ul>
                {updateRequests.map((request) => (
                    <li key={request.fileId}>
                        File ID: {request.fileId} - New Hash: {request.newIpfsHash} - Requester: {request.requester}
                        <button onClick={() => handleApproveUpdate(request.fileId)}>Approve</button>
                    </li>
                ))}
            </ul>
            <h3>Pending Consent Requests</h3>
            <ul>
                {consentRequests.map((request) => (
                    <li key={request.fileId}>
                        File ID: {request.fileId} - IPFS Hash: {request.ipfsHash} - Requester: {request.requester}
                        <button onClick={() => handleApproveConsent(request.fileId)}>Approve</button>
                        <button onClick={() => handleRejectConsent(request.fileId)}>Reject</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ApproverDashboard;