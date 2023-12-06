// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {SenderV3} from "./SenderV3.sol";

contract VirtualHopV3 is CCIPReceiver, SenderV3 {
    
    struct Hop {
        uint64 chainSelector;
        address receiver;
    }

    event MessageSent(bytes32 indexed messageId);
    event MessageHopped(bytes32 indexed messageId);  

    constructor(address _router, address _linkToken, address _bnmToken) 
    SenderV3(_router, _linkToken, _bnmToken) 
    CCIPReceiver(_router) {}

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        (Hop[] memory hops, uint256 amount, uint256 gasLimit) = abi.decode(message.data, (Hop[],uint256,uint256));

        Hop memory nextHop = hops[0];
        hops = leftShift(hops);

        bytes memory hopData = abi.encode(hops,amount,gasLimit);

        bytes32 messageId = _sendMessage(nextHop.chainSelector, nextHop.receiver, amount, gasLimit, hopData);
        emit MessageHopped(messageId);
    }

    function sendMessage(
        uint256 amount,
        uint256 gasLimit,
        Hop[] memory hops
    ) external returns(bytes32) {
        Hop memory nextHop = hops[0];
        hops = leftShift(hops);

        bytes memory hopData = abi.encode(hops,amount,gasLimit);

        bytes32 messageId = _sendMessage(nextHop.chainSelector, nextHop.receiver, amount, gasLimit, hopData);
        emit MessageSent(messageId);
        return messageId;

    }

    function leftShift(Hop[] memory hops) private pure returns(Hop[] memory array){
        array = new Hop[](hops.length-1);
        for(uint256 index; index < array.length;){
            array[index] = hops[index+1];
            unchecked{index++;}
        }
    }

    receive() external payable{}
}
