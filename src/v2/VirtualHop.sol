// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {Sender} from "./Sender.sol";

contract VirtualHop is CCIPReceiver, Sender {
    
    struct Destination {
        uint64 chainSelector;
        address receiver;
        uint256 amount;
    }

    struct HopData {
        uint256 param1;
        uint256 param2;
        uint64 chainSelector;
        address receiver;
        uint256 amount;
    }  

    event MessageSent(bytes32 messageId);
    event MessageHopped(bytes32 messageId);  

    constructor(address _router, address _linkToken, address _bnmToken) 
    Sender(_router, _linkToken, _bnmToken) 
    CCIPReceiver(_router) {}

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        HopData memory hopData = abi.decode(message.data, (HopData));
        bytes32 messageId = _sendMessage(hopData.chainSelector, hopData.receiver, hopData.amount, 0, "");
        emit MessageHopped(messageId);
    }

    function SendMessage(
        uint64 chainSelector, 
        address receiver,
        uint256 amount,
        uint256 gasLimit,
        uint64 destinationChainSelector,
        address destinationReceiver
    ) external returns(bytes32) {
        string memory destination = string(abi.encode(Destination(destinationChainSelector, destinationReceiver, amount)));
        bytes32 messageId = _sendMessage(chainSelector, receiver, amount, gasLimit, destination);
        emit MessageSent(messageId);
        return messageId;
    }
}
