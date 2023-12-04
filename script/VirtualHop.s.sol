// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {VirtualHop} from "../src/v2/VirtualHop.sol";
import {Config} from "./Config.s.sol";

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
        VirtualHop test = new VirtualHop(router, linkToken, bnmToken);
        vm.stopBroadcast();

        return test;
    }
}
