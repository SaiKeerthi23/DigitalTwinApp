import React, { useState } from 'react';

function RejectConsent({ web3, accounts, contract, consentRequests }) {
    const [fileId, setFileId] = useState('');

    const handleRejectConsent = async () => {
        if (!web3 || !accounts || !contract) return;
        try {
            await contract.methods.rejectConsent(fileId).send({ from: accounts[0] });
            alert('Consent rejected');
            setFileId('');
        } catch (error) {
            console.error('Consent rejection failed', error);
            alert('Consent rejection failed');
        }
    };

    return (
        <div className="reject-consent">
            <h3>Reject Consent</h3>
            <select value={fileId} onChange={(e) => setFileId(e.target.value)}>
                <option value="">Select Request ID</option>
                {consentRequests.map((request) => (
                    <option key={request.fileId} value={request.fileId}>
                        File ID: {request.fileId} - IPFS Hash: {request.ipfsHash}
                    </option>
                ))}
            </select>
            <button onClick={handleRejectConsent}>Reject</button>
        </div>
    );
}

export default RejectConsent;