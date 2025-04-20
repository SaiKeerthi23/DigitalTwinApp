import React, { useState } from 'react';

function FileUpload({ web3, accounts, contract }) {
    const [fileHash, setFileHash] = useState('');
    const [fileSize, setFileSize] = useState(0);
    const [fileType, setFileType] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileDescription, setFileDescription] = useState('');

    const handleUpload = async () => {
        if (!web3 || !accounts || !contract) return;
        try {
            await contract.methods.uploadFile(fileHash, fileSize, fileType, fileName, fileDescription).send({ from: accounts[0] });
            alert('File uploaded successfully');
            setFileHash('');
            setFileSize(0);
            setFileType('');
            setFileName('');
            setFileDescription('');
        } catch (error) {
            console.error('File upload failed', error);
            alert('File upload failed');
        }
    };

    return (
        <div className="file-upload">
            <h3>Upload File</h3>
            <input type="text" placeholder="File Hash" value={fileHash} onChange={(e) => setFileHash(e.target.value)} />
            <input type="number" placeholder="File Size" value={fileSize} onChange={(e) => setFileSize(parseInt(e.target.value))} />
            <input type="text" placeholder="File Type" value={fileType} onChange={(e) => setFileType(e.target.value)} />
            <input type="text" placeholder="File Name" value={fileName} onChange={(e) => setFileName(e.target.value)} />
            <input type="text" placeholder="File Description" value={fileDescription} onChange={(e) => setFileDescription(e.target.value)} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}

export default FileUpload;