// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";


contract TokenMock is IERC20 {
    function totalSupply() external view override returns (uint256) {}

    uint256 private constant MAX_INT = 2**256 - 1;

    uint256 private balance;
    bool private approved;

    constructor(){
        balance = MAX_INT;
        approved = true;
    }

    function setMaxBalance() external {
        balance = MAX_INT;
    }

    function setZeroBalance() external {
        balance = 0;
    }

    function setApproveFailed() external {
        approved = false;
    }

    function setApproveSuccess() external {
        approved = true;
    }

    function balanceOf(
        address account
    ) external view override returns (uint256) {
        return balance;
    }

    function transfer(
        address to,
        uint256 amount
    ) external override returns (bool) {
        return true;
    }

    function allowance(
        address owner,
        address spender
    ) external view override returns (uint256) {
        return 0;
    }

    function approve(
        address spender,
        uint256 amount
    ) external override returns (bool) {
        return approved;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external override returns (bool) {
        return true;
    }
}