// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {VirtualHop} from "../src/VirtualHop.sol";
import {Config} from "./Config.s.sol";
import {TokenMock} from "../test/mock/TokenMock.sol";
import {CCIPRouterMock} from "../test/mock/CCIPRouterMock.sol";

contract VirtualHopScript is Script {
    function setUp() public {}

    function run() public returns (VirtualHop) {
        Config config = new Config();
        (
            address router,
            address linkToken,
            address bnmToken
        ) = config.networkConfig();

        vm.startBroadcast();
        VirtualHop virtualHop = new VirtualHop(router, linkToken, bnmToken);
        vm.stopBroadcast();

        return virtualHop;
    }

    function runCustom() public returns(VirtualHop,TokenMock,TokenMock) {
        vm.startBroadcast();
        CCIPRouterMock ccipRouterMock = new CCIPRouterMock();
        TokenMock linkTokenMock = new TokenMock();
        TokenMock bnmTokenMock = new TokenMock();
        VirtualHop virtualHop = new VirtualHop(
            address(ccipRouterMock), 
            address(linkTokenMock), 
            address(bnmTokenMock)
        );
        vm.stopBroadcast();
        return(virtualHop,linkTokenMock,bnmTokenMock);
    }
}
