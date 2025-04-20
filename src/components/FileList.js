import React from 'react';

function FileList({ files }) {
    return (
        <div className="file-list">
            <h3>Uploaded Files</h3>
            {files.length === 0 ? (
                <p>No files uploaded yet.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Hash</th>
                            <th>Size</th>
                            <th>Type</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file) => (
                            <tr key={file.fileID}>
                                <td>{file.fileID}</td>
                                <td>{file.fileName}</td>
                                <td>{file.fileHash}</td>
                                <td>{file.fileSize}</td>
                                <td>{file.fileType}</td>
                                <td>{file.fileDescription}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default FileList;