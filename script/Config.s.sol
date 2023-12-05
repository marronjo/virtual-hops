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
            networkConfig = getOptimismGoerliConfig();
        }else if(block.chainid == 11155111){
            networkConfig = getEthereumSepoliaConfig();
        }else if(block.chainid == 80001){
            networkConfig = getPolygonMumbaiConfig();
        }else if(block.chainid == 97){
            networkConfig = getBNBTestnetConfig();
        }else if(block.chainid == 84531){
            networkConfig = getBaseGoerliConfig();
        }else if(block.chainid == 31337){
            networkConfig = getLocalTestnetConfig();
        }
    }

    function getLocalTestnetConfig() public pure returns(NetworkConfig memory) {
        return NetworkConfig({
            router: address(1),
            linkToken: address(0),
            bnmToken: address(0)
        });
    }

    function getAvalancheFujiConfig() public pure returns(NetworkConfig memory) {
        return NetworkConfig({
            router: 0x554472a2720E5E7D5D3C817529aBA05EEd5F82D8,
            linkToken: 0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846,
            bnmToken: 0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4
        });
    }

    function getOptimismGoerliConfig() public pure returns(NetworkConfig memory) {
        return NetworkConfig({
            router: 0xEB52E9Ae4A9Fb37172978642d4C141ef53876f26,
            linkToken: 0xdc2CC710e42857672E7907CF474a69B63B93089f,
            bnmToken: 0xaBfE9D11A2f1D61990D1d253EC98B5Da00304F16
        });
    }

    function getEthereumSepoliaConfig() public pure returns(NetworkConfig memory) {
        return NetworkConfig({
            router: 0xD0daae2231E9CB96b94C8512223533293C3693Bf,
            linkToken: 0x779877A7B0D9E8603169DdbD7836e478b4624789,
            bnmToken: 0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05
        });
    }

    function getPolygonMumbaiConfig() public pure returns(NetworkConfig memory) {
        return NetworkConfig({
            router: 0x70499c328e1E2a3c41108bd3730F6670a44595D1,
            linkToken: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB,
            bnmToken: 0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40
        });
    }

    function getBNBTestnetConfig() public pure returns(NetworkConfig memory) {
        return NetworkConfig({
            router: 0x9527E2d01A3064ef6b50c1Da1C0cC523803BCFF2,
            linkToken: 0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06,
            bnmToken: 0xbFA2ACd33ED6EEc0ed3Cc06bF1ac38d22b36B9e9
        });
    }

    function getBaseGoerliConfig() public pure returns(NetworkConfig memory) {
        return NetworkConfig({
            router: 0xA8C0c11bf64AF62CDCA6f93D3769B88BdD7cb93D,
            linkToken: 0xD886E2286Fd1073df82462ea1822119600Af80b6,
            bnmToken: 0xbf9036529123DE264bFA0FC7362fE25B650D4B16
        });
    }
}
