// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {HelloSender} from "./HelloSender.sol";

contract SendHello is HelloSender {

    address immutable linkToken;
    uint64 immutable dest;

    constructor(address _router, address _link, uint64 _destination) HelloSender(_router) {
        linkToken = _link;
        dest = _destination;
    }

    function sendMessage() external returns(bytes32) {
        return _sendMessage(
            dest,                                           //destination chain selector set in constructor
            0x3e62Dff1cb16F2902BC7E7400d611cCfc1368981,     //random EOA address
            linkToken,                                      //LINK token to pay CCIP fee
            string(abi.encode("Hello World"))               //encoded string to send to receiver
        );
    }
}