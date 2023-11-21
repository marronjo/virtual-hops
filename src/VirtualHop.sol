// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import {Sender} from "./Sender.sol";

contract VirtualHop is Sender {

    constructor(address router, address link) Sender(router, link) {}

    /**
     * send message / tokens from source chain
     */
    function send(
        uint64 destinationChainSelector,
        address receiver,
        address token,
        uint256 amount,
        address feeToken,
        string memory data
        ) external returns(bytes32) {
        return _sendMessage(
            destinationChainSelector,
            receiver,
            token,
            amount,
            feeToken,
            data
        );
    }
    
    /**
     * receive message / tokens from source chain on 
     * intermediary chain send onto destination chain
     */
    function hop() external {

    }

    /**
     * receive message / tokens on destination chain
     */
    function collect() external {

    }
}
