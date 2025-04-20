import React, { useState } from 'react';

function UpdateFileHash({ web3, accounts, contract, files }) {
    const [fileId, setFileId] = useState('');
    const [newFileHash, setNewFileHash] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdateHash = async () => {
        if (!web3 || !accounts || !contract) return;
        if (!fileId || !newFileHash) {
            alert("Please select a file and enter a new hash.");
            return;
        }
        setLoading(true);
        try {
            const file = await contract.methods.files(fileId).call();
            if (file.uploader === accounts[0]) {
                await contract.methods.updateFileHash(fileId, newFileHash).send({ from: accounts[0], gas: 300000 });
                alert('File hash updated successfully');
            } else {
                await contract.methods.requestUpdate(fileId, newFileHash).send({ from: accounts[0], gas: 300000 });
                alert('Update request sent to approvers.');
            }
            setFileId('');
            setNewFileHash('');
        } catch (error) {
            console.error('File hash update failed', error);
            alert('File hash update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="update-file-hash">
            <h3>Update File Hash</h3>
            <select value={fileId} onChange={(e) => setFileId(e.target.value)}>
                <option value="">Select File ID</option>
                {files.map((file) => (
                    <option key={file.fileID} value={file.fileID}>
                        {file.fileName} (ID: {file.fileID})
                    </option>
                ))}
            </select>
            <input type="text" placeholder="New File Hash" value={newFileHash} onChange={(e) => setNewFileHash(e.target.value)} />
            <button onClick={handleUpdateHash} disabled={loading}>
                {loading ? "Updating..." : "Update Hash"}
            </button>
        </div>
    );
}

export default UpdateFileHash;