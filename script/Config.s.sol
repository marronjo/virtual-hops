// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {Script, console2} from "forge-std/Script.sol";

contract Config is Script {

    struct NetworkConfig{
        address router;
        address linkToken;
        address bnmToken;
    }

    NetworkConfig public networkConfig;

    constructor(){
        if(block.chainid == 43113){
            networkConfig = getAvalancheFujiConfig();
        }else if(block.chainid == 420){
            networkConfig = getOptimismConfig();
        }else if(block.chainid == 11155111){
            networkConfig = getSepoliaConfig();
        }
    }

    function getAvalancheFujiConfig() public pure returns(NetworkConfig memory) {
        return NetworkConfig(
            0x554472a2720E5E7D5D3C817529aBA05EEd5F82D8,
            0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846,
            0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4
        );
    }

    function getOptimismConfig() public pure returns(NetworkConfig memory) {
        return NetworkConfig(
            0xEB52E9Ae4A9Fb37172978642d4C141ef53876f26,
            0xdc2CC710e42857672E7907CF474a69B63B93089f,
            0xaBfE9D11A2f1D61990D1d253EC98B5Da00304F16
        );
    }

    function getSepoliaConfig() public pure returns(NetworkConfig memory) {
        return NetworkConfig(
            0xD0daae2231E9CB96b94C8512223533293C3693Bf,
            0x779877A7B0D9E8603169DdbD7836e478b4624789,
            0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05
        );
    }
}
