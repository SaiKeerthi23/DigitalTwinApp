import React, { useState } from 'react';

function RequestUpdate({ web3, accounts, contract, files }) {
    const [fileId, setFileId] = useState('');
    const [newIpfsHash, setNewIpfsHash] = useState('');

    const handleRequestUpdate = async () => {
        if (!web3 || !accounts || !contract) return;
        try {
            await contract.methods.requestUpdate(fileId, newIpfsHash).send({ from: accounts[0] });
            alert('Update request submitted');
            setFileId('');
            setNewIpfsHash('');
        } catch (error) {
            console.error('Update request failed', error);
            alert('Update request failed');
        }
    };

    return (
        <div className="request-update">
            <h3>Request Document Update</h3>
            <select value={fileId} onChange={(e) => setFileId(e.target.value)}>
                <option value="">Select File ID</option>
                {files.map((file) => (
                    <option key={file.fileID} value={file.fileID}>
                        {file.fileName} (ID: {file.fileID})
                    </option>
                ))}
            </select>
            <input type="text" placeholder="New IPFS Hash" value={newIpfsHash} onChange={(e) => setNewIpfsHash(e.target.value)} />
            <button onClick={handleRequestUpdate}>Request Update</button>
        </div>
    );
}

export default RequestUpdate;