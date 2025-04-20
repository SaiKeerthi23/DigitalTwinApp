import React, { useState } from 'react';

function ApproveConsent({ web3, accounts, contract, consentRequests }) {
    const [fileId, setFileId] = useState('');

    const handleApproveConsent = async () => {
        if (!web3 || !accounts || !contract) return;
        try {
            await contract.methods.approveConsent(fileId).send({ from: accounts[0] });
            alert('Consent approved');
            setFileId('');
        } catch (error) {
            console.error('Consent approval failed', error);
            alert('Consent approval failed');
        }
    };

    return (
        <div className="approve-consent">
            <h3>Approve Consent</h3>
            <select value={fileId} onChange={(e) => setFileId(e.target.value)}>
                <option value="">Select Request ID</option>
                {consentRequests.map((request) => (
                    <option key={request.fileId} value={request.fileId}>
                        File ID: {request.fileId} - IPFS Hash: {request.ipfsHash}
                    </option>
                ))}
            </select>
            <button onClick={handleApproveConsent}>Approve</button>
        </div>
    );
}

export default ApproveConsent;