// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

interface IMyToken {
    function getPastVotes(address,uint256) external view returns (uint256);

}
/// @title Voting with delegation.
contract TokenizedBallot {
 
    // This is a type for a single proposal.
    struct Proposal {
        bytes32 name;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }

    address public chairperson;
 
    // A dynamically-sized array of `Proposal` structs.
    Proposal[] public proposals;

    IMyToken public tokenContract;

    /// Create a new ballot to choose one of `proposalNames`.
    constructor(bytes32[] memory proposalNames, address _tokenContract, uint256 _targetBlockNumber) {
        require(_targetBlockNumber < block.number, "Target block number must be in the past");

        chairperson = msg.sender;

        for (uint i = 0; i < proposalNames.length; i++) {
 
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
        tokenContract = IMyToken(_tokenContract);
    }
 
    
    /// Give your vote (including votes delegated to you)
    /// to proposal `proposals[proposal].name`.
    function vote(uint proposal, uint amount) external {
        
        proposals[proposal].voteCount += amount;

        // TODO: implement the vote function
    }

    /// @dev Computes the winning proposal taking all
    /// previous votes into account.
    function winningProposal() public view
            returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    // Calls winningProposal() function to get the index
    // of the winner contained in the proposals array and then
    // returns the name of the winner
    function winnerName() external view
            returns (bytes32 winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }
}

/// TODO DEPLOY THE TOKEN CONTRACT, GIVE team members tokens, than deploy the tokenized ballot 

// scripts to check the results