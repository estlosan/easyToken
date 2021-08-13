// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IEasyToken.sol";

contract Operator is Ownable {


    event SentEasyToken(
        address indexed sender,
        address indexed recipient,
        uint amount
    );

    event OperatorWithdraw(
        address indexed operator,
        address indexed sender,
        uint amount
    );

    event AddedOperator(
        address operator
    );

    event RemovedOperator(
        address operator
    );

    mapping (address => bool) public isOperator;

    IEasyToken public token;

    constructor () public {
    }

    modifier onlyOperator {
        require(
            isOperator[msg.sender] == true,
            "Caller is not operator"
        );
        _;
    }

    function operatorSendEasyToken(address sender, address recipient, uint amount) external onlyOperator {
        IEasyToken easyToken = token;

        require(address(easyToken) != address(0), "Token address not set");
        token.operatorSend(sender, recipient, amount, "", "");

        emit SentEasyToken(sender, recipient, amount);
    }

    function operatorWithdraw(address sender, uint amount) external onlyOperator {
        IEasyToken easyToken = token;

        require(address(easyToken) != address(0), "Token address not set");
        token.withdraw(sender, amount);

        emit OperatorWithdraw(msg.sender, sender, amount);
    }

    function addOperator(address operator) external onlyOwner {
        require(
            !isOperator[operator], 
            'Address is operator'
        );
        isOperator[operator] = true;

        emit AddedOperator(operator);
    }

    function removeOperator(address operator) external onlyOwner {
        require(
            isOperator[operator], 
            'Operator was removed before'
        );
        isOperator[operator] = false;

        emit RemovedOperator(operator);
    }

    function setToken(IEasyToken newToken) external onlyOwner {
        require(address(newToken) != address(0), "Address cannot be 0");
        token = IEasyToken(newToken);
    }
}