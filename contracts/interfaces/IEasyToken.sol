// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts-upgradeable/token/ERC777/IERC777Upgradeable.sol";

interface IEasyToken is IERC777Upgradeable {
    function withdraw(address sender, uint amount) external;
}