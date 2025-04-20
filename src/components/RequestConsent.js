import React, { useState } from 'react';

function RequestConsent({ web3, accounts, contract, files }) {
    const [fileId, setFileId] = useState('');
    const [ipfsHash, setIpfsHash] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRequestConsent = async () => {
        if (!web3 || !accounts || !contract) return;
        if (!fileId || !ipfsHash) {
            alert("Please select a file and enter the IPFS hash.");
            return;
        }
        setLoading(true);
        try {
            await contract.methods.requestApproval(fileId, ipfsHash).send({ from: accounts[0], gas: 300000 });
            alert('Consent request sent to approvers.');
            setFileId('');
            setIpfsHash('');
        } catch (error) {
            console.error('Consent request failed', error);
            alert('Consent request failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="request-consent">
            <h3>Request Document Consent</h3>
            <select value={fileId} onChange={(e) => setFileId(e.target.value)}>
                <option value="">Select File ID</option>
                {files.map((file) => (
                    <option key={file.fileID} value={file.fileID}>
                        {file.fileName} (ID: {file.fileID})
                    </option>
                ))}
            </select>
            <input type="text" placeholder="IPFS Hash" value={ipfsHash} onChange={(e) => setIpfsHash(e.target.value)} />
            <button onClick={handleRequestConsent} disabled={loading}>
                {loading ? "Requesting..." : "Request Consent"}
            </button>
        </div>
    );
}

export default RequestConsent;