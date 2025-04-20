import React from 'react';

function NotificationList({ consentRequests, updateRequests }) {
    return (
        <div className="notification-list">
            <h3>Notifications</h3>
            <h4>Consent Requests</h4>
            {consentRequests.length === 0 ? (
                <p>No consent requests.</p>
            ) : (
                <ul>
                    {consentRequests.map((request) => (
                        <li key={request.fileId}>
                            File ID: {request.fileId} - IPFS Hash: {request.ipfsHash} - Requester: {request.requester}
                        </li>
                    ))}
                </ul>
            )}
            <h4>Update Requests</h4>
            {updateRequests.length === 0 ? (
                <p>No update requests.</p>
            ) : (
                <ul>
                    {updateRequests.map((request) => (
                        <li key={request.fileId}>
                            File ID: {request.fileId} - New IPFS Hash: {request.newIpfsHash} - Requester: {request.requester}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default NotificationList;