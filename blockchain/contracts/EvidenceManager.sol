// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EvidenceManager {

    enum Role { NONE, INVESTIGATOR, VIEWER, JUDGE }

    mapping(address => Role) public roles;
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    struct Evidence {
        string cid;       // IPFS CID
        bytes32 fileHash; // hash of original file
        address uploadedBy;
        uint256 timestamp;
        bool verified;
    }

    enum Action { NONE, UPLOAD, VIEW, VERIFY }

    struct AccessLog {
        address performedBy;
        uint256 timestamp;
        Action action;
    }

    mapping(string => Evidence[]) private caseEvidences;
    mapping(string => AccessLog[]) private caseAccessLogs;

    // Admin assigns roles
    function assignRole(address user, Role role) external {
        require(msg.sender == admin, "Only admin");
        roles[user] = role;
    }

    // Investigator uploads evidence
    function uploadEvidence(string memory caseId, string memory cid, bytes32 fileHash) external {
        require(roles[msg.sender] == Role.INVESTIGATOR, "Not investigator");
        caseEvidences[caseId].push(Evidence(cid, fileHash, msg.sender, block.timestamp, false));
        caseAccessLogs[caseId].push(AccessLog(msg.sender, block.timestamp, Action.UPLOAD));
    }

    // Viewer or Judge accesses evidence
    function getEvidence(string memory caseId, uint256 index) 
    external view returns (string memory cid, bytes32 fileHash, bool verified, uint256 timestamp) 
    {
        Evidence storage e = caseEvidences[caseId][index];
        return (e.cid, e.fileHash, e.verified, e.timestamp);
    }

    function logEvidenceAccess(string memory caseId, uint256 index) external {
        Role r = roles[msg.sender];
        require(r == Role.VIEWER || r == Role.JUDGE, "Not allowed");
        caseAccessLogs[caseId].push(AccessLog(msg.sender, block.timestamp, Action.VIEW));
    }

    // Judge verifies evidence
    function verifyEvidence(string memory caseId, uint256 index, bytes32 localFileHash) external {
        require(roles[msg.sender] == Role.JUDGE, "Only judge");
        Evidence storage e = caseEvidences[caseId][index];
        require(e.fileHash == localFileHash, "Hash mismatch");
        e.verified = true;
        caseAccessLogs[caseId].push(AccessLog(msg.sender, block.timestamp, Action.VERIFY));
    }

    function getEvidenceCount(string memory caseId) external view returns (uint256) {
        return caseEvidences[caseId].length;
    }

    function getAccessLogs(string memory caseId) external view returns (AccessLog[] memory) {
        return caseAccessLogs[caseId];
    }
}
