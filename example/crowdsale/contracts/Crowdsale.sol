// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdsale {
    address public owner;
    mapping(address => uint256) public balances;

    event TokensPurchased(address indexed buyer, uint256 amount);
    event Withdrawal(address indexed recipient, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function buyTokens() public payable {
        require(msg.value > 0, "Send ETH to buy tokens");
        balances[msg.sender] += msg.value;
        emit TokensPurchased(msg.sender, msg.value);
    }

    function withdraw() public {
        require(msg.sender == owner, "Only the owner can withdraw");
        uint256 amount = address(this).balance;
        require(amount > 0, "No funds to withdraw");
        payable(owner).transfer(amount);
        emit Withdrawal(owner, amount);
    }
}