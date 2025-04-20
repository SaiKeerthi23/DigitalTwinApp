// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DigitalTwinManagement {
    address public admin;
    uint public fileCount = 0;
    uint public approverCount = 0;
    uint public totalApprovers = 0;
    
    enum DocumentState { Created, WaitForApproversSignature, Updated }
    enum ParticipantState { NotSubmitted, SubmittedForApproval, UpdatedDocument, ApprovalNotProvided, ApprovalProvided }
    enum ApproverState { NotApproved, ApprovalSuccess, ApprovalFailed }

    struct File {
        uint fileID;
        string fileHash;
        uint fileSize;
        string fileType;
        string fileName;
        string fileDescription;
        uint uploadTime;
        address payable uploader;
    }

    struct Participant {
        address participantAddress;
        ParticipantState state;
        bool isRegistered;
    }

    struct UpdateRequest {
        uint fileId; // Added fileId field
        string newIpfsHash;
        address requester;
        uint approvals;
        mapping(address => bool) approverVotes;
        bool isApproved;
    }

    struct ConsentRequest {
        uint fileId;
        string ipfsHash;
        address requester;
        uint approvals;
        uint rejections;
        bool isFinalized;
        mapping(address => ApproverState) approverVotes;
    }

    mapping(uint => File) public files;
    mapping(address => Participant) public participants;
    mapping(address => bool) public approvers;
    mapping(uint => UpdateRequest) public updateRequests;
    mapping(uint => ConsentRequest) public consentRequests;

    event FileUploaded(uint fileId, string fileHash, uint fileSize, string fileType, string fileName, string fileDescription, uint uploadTime, address uploader);
    event FileHashUpdated(uint fileId, string oldFileHash, string newFileHash);
    event UpdateRequested(uint fileId, string newIpfsHash, address requester);
    event UpdateApproved(uint fileId, string newIpfsHash, uint approvals);
    event DocumentUpdated(uint fileId, string newIpfsHash);
    event ApprovalRequested(uint fileId, string ipfsHash, address requester);
    event ApprovalUpdated(uint fileId, uint approvals, uint rejections);
    event ApprovalFailed(uint fileId, uint rejections);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyRegisteredUser() {
        require(participants[msg.sender].isRegistered, "User not registered");
        _;
    }

    modifier onlyApprover() {
        require(approvers[msg.sender], "Only approvers can validate");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Function to upload a new file
    function uploadFile(
        string memory _fileHash,
        uint _fileSize,
        string memory _fileType,
        string memory _fileName,
        string memory _fileDescription
    ) public {
        require(bytes(_fileHash).length > 0, "File hash is required");
        require(_fileSize > 0, "File size should be greater than zero");
        require(bytes(_fileType).length > 0, "File type is required");
        require(bytes(_fileName).length > 0, "File name is required");
        require(bytes(_fileDescription).length > 0, "File description is required");

        fileCount++;
        files[fileCount] = File(
            fileCount,
            _fileHash,
            _fileSize,
            _fileType,
            _fileName,
            _fileDescription,
            block.timestamp,
            payable(msg.sender)
        );

        emit FileUploaded(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, block.timestamp, payable(msg.sender));
    }

    // Function to update the file hash (versioning)
    function updateFileHash(uint _fileId, string memory _newFileHash) public {
        require(_fileId > 0 && _fileId <= fileCount, "Invalid file ID");
        File storage file = files[_fileId];
        require(msg.sender == file.uploader, "Only the uploader can update the file hash");
        require(keccak256(abi.encodePacked(file.fileHash)) != keccak256(abi.encodePacked(_newFileHash)), "New hash must be different");

        string memory oldHash = file.fileHash;
        file.fileHash = _newFileHash;

        emit FileHashUpdated(_fileId, oldHash, _newFileHash);
    }

    // Admin function to register users
    function registerUser(address _user) public onlyAdmin {
        participants[_user] = Participant(_user, ParticipantState.NotSubmitted, true);
    }

    // Admin function to register approvers
    function registerApprover(address _approver) public onlyAdmin {
        approvers[_approver] = true;
        approverCount++;
        totalApprovers++; // Update totalApprovers when adding a new approver
    }

    // Function for users to request document update approval
    function requestUpdate(uint _fileId, string memory _newIpfsHash) public onlyRegisteredUser {
        File storage file = files[_fileId];
        require(file.fileID != 0, "File does not exist");
        require(msg.sender == file.uploader, "Only the uploader can request an update");
        require(keccak256(abi.encodePacked(file.fileHash)) != keccak256(abi.encodePacked(_newIpfsHash)), "Document hash must be different");

        participants[msg.sender].state = ParticipantState.SubmittedForApproval;

        UpdateRequest storage request = updateRequests[_fileId];
        request.fileId = _fileId; // Set the fileId in the UpdateRequest
        request.newIpfsHash = _newIpfsHash;
        request.requester = msg.sender;
        request.approvals = 0;
        request.isApproved = false;

        emit UpdateRequested(_fileId, _newIpfsHash, msg.sender);
    }

    // Function for approvers to approve document update
    function approveUpdate(uint _fileId) public onlyApprover {
        UpdateRequest storage request = updateRequests[_fileId];
        require(request.fileId != 0, "Update request does not exist");
        require(!request.approverVotes[msg.sender], "Approver has already voted");

        request.approverVotes[msg.sender] = true;
        request.approvals++;

        if (request.approvals >= (approverCount * 2) / 3) {
            updateFileHash(_fileId, request.newIpfsHash);
            request.isApproved = true;
            emit DocumentUpdated(_fileId, request.newIpfsHash);

            // Reset approvals and approverVotes
            request.approvals = 0;
            for (uint i = 0; i < approverCount; i++) {
                address approver = address(0); // TODO: Get the i-th approver address
                request.approverVotes[approver] = false;
            }
        } else {
            emit UpdateApproved(_fileId, request.newIpfsHash, request.approvals);
        }
    }

    // Function for users to request consent for document approval
    function requestApproval(uint _fileId, string memory _ipfsHash) public onlyRegisteredUser {
        File storage file = files[_fileId];

        require(file.fileID != 0, "File does not exist");
        require(msg.sender == file.uploader, "Only uploader can request approval");
        require(keccak256(abi.encodePacked(file.fileHash)) == keccak256(abi.encodePacked(_ipfsHash)), "IPFS hash mismatch");

        participants[msg.sender].state = ParticipantState.ApprovalProvided;

        ConsentRequest storage request = consentRequests[_fileId];
        request.fileId = _fileId;
        request.ipfsHash = _ipfsHash;
        request.requester = msg.sender;
        request.approvals = 0;
        request.rejections = 0;
        request.isFinalized = false;

        emit ApprovalRequested(_fileId, _ipfsHash, msg.sender);
    }

    // Function for approvers to approve the document consent
    function approveConsent(uint _fileId) public onlyApprover {
        ConsentRequest storage request = consentRequests[_fileId];

        require(request.fileId != 0, "Approval request does not exist");
        require(!request.isFinalized, "Approval already finalized");

        request.approverVotes[msg.sender] = ApproverState.ApprovalSuccess;
        request.approvals++;

        if (request.approvals >= (totalApprovers * 2) / 3) {
            request.isFinalized = true;
            emit DocumentUpdated(_fileId, request.ipfsHash);
        } else {
            emit ApprovalUpdated(_fileId, request.approvals, request.rejections);
        }
    }

    // Function for approvers to reject the document consent
    function rejectConsent(uint _fileId) public onlyApprover {
        ConsentRequest storage request = consentRequests[_fileId];

        require(request.fileId != 0, "Approval request does not exist");
        require(!request.isFinalized, "Approval already finalized");

        request.approverVotes[msg.sender] = ApproverState.ApprovalFailed;
        request.rejections++;

        if (request.rejections >= totalApprovers / 3) {
            request.isFinalized = true;
            emit ApprovalFailed(_fileId, request.rejections);
        } else {
            emit ApprovalUpdated(_fileId, request.approvals, request.rejections);
        }
    }
}