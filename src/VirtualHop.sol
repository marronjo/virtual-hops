// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {Sender} from "./Sender.sol";

contract VirtualHop is CCIPReceiver, Sender {

    error VirtualHop__NextHopEmpty();
    
    struct Hop {
        address receiver;
        uint64 chainSelector;
    }

    event MessageSent(bytes32 indexed messageId);
    event MessageHopped(bytes32 indexed messageId);  

    constructor(address _router, address _linkToken, address _bnmToken) 
    Sender(_router, _linkToken, _bnmToken) 
    CCIPReceiver(_router) {}

    receive() external payable{}

    function sendMessage(
        uint256 amount,
        uint256 gasLimit,
        Hop[] calldata hops
    ) external returns(bytes32) {
        bytes32 messageId = _encodeDataSendMessage(amount, gasLimit, hops);
        emit MessageSent(messageId);
        return messageId;
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        (Hop[] memory hops, uint256 amount, uint256 gasLimit) = abi.decode(message.data, (Hop[],uint256,uint256));
        bytes32 messageId = _encodeDataSendMessage(amount, gasLimit, hops);
        emit MessageHopped(messageId);
    }

    function _encodeDataSendMessage(
        uint256 amount,
        uint256 gasLimit,
        Hop[] memory hops
        ) private returns(bytes32) {

        if(hops.length == 0){
            revert VirtualHop__NextHopEmpty();
        }

        Hop memory nextHop = hops[0];
        hops = _leftShift(hops);

        bytes memory hopData = abi.encode(hops,amount,gasLimit);

        return _sendMessage(nextHop.chainSelector, nextHop.receiver, amount, gasLimit, hopData);
    }

    function _leftShift(Hop[] memory hops) private pure returns(Hop[] memory array){
        array = new Hop[](hops.length-1);
        for(uint256 index; index < array.length;){
            array[index] = hops[index+1];
            unchecked{index++;}
        }
    }
}
