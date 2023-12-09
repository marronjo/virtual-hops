// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

contract CCIPRouterMock is IRouterClient {

    uint64 private validChainSelector = 12345678;
    uint256 private validBaseFee = 1000;
    uint256 private feeBerByte = 15;
    
    function isChainSupported(
        uint64 chainSelector
    ) external view override returns (bool supported) {
        if(chainSelector == validChainSelector){ return true; }
        return false;
    }

    function getSupportedTokens(
        uint64 chainSelector
    ) external view override returns (address[] memory tokens) {
        if(chainSelector == validChainSelector){
            tokens = new address[](1);
            tokens[0] = address(0);
        }else{
            tokens = new address[](0);
        }
    }

    function getFee(
        uint64 destinationChainSelector,
        Client.EVM2AnyMessage memory message
    ) external view override returns (uint256 fee) {
        require(destinationChainSelector == validChainSelector, "Invalid chain selector!");
        uint256 bytesLength = message.data.length;
        fee = validBaseFee + (bytesLength*feeBerByte);
    }

    function ccipSend(
        uint64 destinationChainSelector,
        Client.EVM2AnyMessage calldata message
    ) external payable override returns (bytes32) {
        require(destinationChainSelector == validChainSelector, "Invalid chain selector!");
        return bytes32(message.data);
    }
}