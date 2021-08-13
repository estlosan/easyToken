// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GeoToken is ERC20 {

    uint256 constant public maxSupply = 1000000000000000000000000000; // 1 thousand millions of tokens
    uint256 constant public preAssigned = 300000000000000000000000000; // 300 hundred millions of tokens

    constructor () public ERC20("GEO Token", "GEO") {
        _mint(msg.sender, preAssigned);
    }
}