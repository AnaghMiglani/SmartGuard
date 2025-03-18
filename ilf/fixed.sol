// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdsale {

    address public owner;
    address public beneficiary;
    uint public startTime;
    uint public endTime;
    uint public rate;
    uint public goal;
    uint public raised;
    mapping(address => uint) public contributions;
    bool public goalReached;
    bool public ended;

    event Contribution(address indexed contributor, uint amount);
    event GoalReached(address indexed beneficiary, uint totalRaised);
    event Refund(address indexed contributor, uint amount);
    event Withdrawal(address indexed beneficiary, uint amount);
    event OwnerChanged(address indexed oldOwner, address indexed newOwner);

    constructor(
        address _beneficiary,
        uint _startTime,
        uint _endTime,
        uint _rate,
        uint _goal
    ) {
        owner = msg.sender;
        beneficiary = _beneficiary;
        startTime = _startTime;
        endTime = _endTime;
        rate = _rate;
        goal = _goal;
        raised = 0;
        goalReached = false;
        ended = false;
    }

    function contribute() external payable {
        require(block.timestamp >= startTime, "Crowdsale hasn't started yet");
        require(block.timestamp <= endTime, "Crowdsale has ended");
        require(!ended, "Crowdsale has ended");

        contributions[msg.sender] += msg.value;
        raised += msg.value;

        emit Contribution(msg.sender, msg.value);

        if (raised >= goal && !goalReached) {
            goalReached = true;
            emit GoalReached(beneficiary, raised);
        }
    }

    function endCrowdsale() external {
        require(block.timestamp > endTime, "Crowdsale hasn't ended yet");
        require(!ended, "Crowdsale already ended");
        ended = true;
    }


    function withdraw() external {
        require(msg.sender == beneficiary, "Only beneficiary can withdraw");
        require(goalReached, "Goal not reached");
        require(ended, "Crowdsale not ended");

        uint amount = address(this).balance;

        (bool success, ) = beneficiary.call{value: amount}("");
        require(success, "Withdrawal failed");

        emit Withdrawal(beneficiary, amount);
    }


    function refund() external {
        require(block.timestamp > endTime, "Crowdsale hasn't ended yet");
        require(!goalReached, "Goal was reached");
        require(contributions[msg.sender] > 0, "No contribution found");

        uint amount = contributions[msg.sender];
        contributions[msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Refund failed");

        emit Refund(msg.sender, amount);

    }

    function setOwner(address _newOwner) external {
        require(msg.sender == owner, "Only owner can change ownership");
        address _oldOwner = owner;
        owner = _newOwner;
        emit OwnerChanged(_oldOwner, _newOwner);
    }

}