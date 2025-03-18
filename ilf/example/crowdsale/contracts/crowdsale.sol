// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableContract {
    address public owner;
    mapping(address => uint256) public balances;

    constructor() {
        owner = tx.origin; // Poor practice: Using tx.origin for ownership
    }

    // Poor practice: No access control for critical function
    function setOwner(address newOwner) public {
        owner = newOwner;
    }

    // Poor practice: No input validation
    function deposit() public payable {
        balances[msg.sender] += msg.value; // No checks for overflow
    }

    // Poor practice: Reentrancy vulnerability
    function withdraw() public {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "Insufficient balance");

        (bool success, ) = msg.sender.call{value: amount}(""); // External call before state update
        require(success, "Transfer failed");

        balances[msg.sender] = 0; // State update happens after external call
    }

    // Poor practice: Block timestamp dependence
    function isLucky() public view returns (bool) {
        return block.timestamp % 2 == 0; // Vulnerable to miner manipulation
    }

    // Poor practice: Unchecked external call
    function callExternal(address payable target) public {
        target.call{value: 1 ether}(""); // No error handling
    }

    // Poor practice: Hardcoded gas limit
    function sendWithGasLimit(address payable recipient) public {
        recipient.transfer(1 ether); // Hardcoded transfer with no error handling
    }

    // Poor practice: Fallback function with no restrictions
    fallback() external payable {}

    // Poor practice: Receive function with no restrictions
    receive() external payable {}
}
