// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {VirtualHopV3} from "../src/v3/VirtualHopV3.sol";
import {Config} from "./Config.s.sol";

contract VirtualHopV3Script is Script {
    function setUp() public {}

    function run() public returns (address) {
        Config config = new Config();
        (
            address router,
            address linkToken,
            address bnmToken
        ) = config.networkConfig();

        vm.startBroadcast();
        VirtualHopV3 virtualHopV3 = new VirtualHopV3(router, linkToken, bnmToken);
        vm.stopBroadcast();

        return address(virtualHopV3);
    }
}
