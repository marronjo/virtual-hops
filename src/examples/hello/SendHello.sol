// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {HelloSender} from "./HelloSender.sol";

contract SendHello is HelloSender {

    address immutable linkToken;
    uint64 immutable dest;

    /**
     * @param _router CCIP Router Client address on source chain - passes value to HelloSender constructor
     * @param _link Link token address on source chain
     * @param _destination address to send message to on destination chain
     */
    constructor(address _router, address _link, uint64 _destination) HelloSender(_router) {
        linkToken = _link;
        dest = _destination;
    }

    /**
     * @return messageId of CCIP message (bytes32) 
     */
    function sendMessage() external returns(bytes32) {
        return _sendMessage(
            dest,                                           //destination chain selector set in constructor
            0x3e62Dff1cb16F2902BC7E7400d611cCfc1368981,     //random EOA address
            linkToken,                                      //LINK token to pay CCIP fee
            string(abi.encode("Hello World"))               //encoded string to send to receiver
        );
    }
}