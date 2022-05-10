// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract VoteDemo is Ownable {
    using Counters for Counters.Counter;

    mapping(uint16 => Counters.Counter) private voteResult;

    mapping(address => bool) public voterVoted;
    uint16 public numberOfCandididates;
    bool public isVoteOpened;
    uint256 public voterCount;

    constructor(uint16 _numberOfCandididates) {
        numberOfCandididates = _numberOfCandididates;
        isVoteOpened = true;
        voterCount = 0;
    }

    modifier voteOpened() {
        require(isVoteOpened, "Vote Closed.");
        _;
    }

    modifier validCandidate(uint16 _candidate) {
        require(_candidate < numberOfCandididates, "Invalid Candidate.");
        _;
    }

    function vote(uint16 _voteTo) external voteOpened validCandidate(_voteTo) {
        require(!voterVoted[msg.sender], "Already Voted.");

        voteResult[_voteTo].increment();

        voterCount++;
        voterVoted[msg.sender] = true;
    }

    function _closeVote() internal voteOpened {
        isVoteOpened = false;
    }

    function closeVote() external onlyOwner {
        _closeVote();
    }

    function viewCandidateVoteCount(uint16 _candidate) external view validCandidate(_candidate) returns(uint) {
        require(!isVoteOpened, "Vote Should be closed before show result");

        return voteResult[_candidate].current();
    }
}
