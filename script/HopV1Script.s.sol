// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {HopV1} from "../src/v1/HopV1.sol";
import {Config} from "./Config.s.sol";

contract HopV1Script is Script {
    function setUp() public {}

    function run() public returns (HopV1) {
        Config config = new Config();
        (
            address router,
            address linkToken,
            address bnmToken
        ) = config.networkConfig();

        vm.startBroadcast();
        HopV1 test = new HopV1(router, linkToken, bnmToken);
        vm.stopBroadcast();

        return test;
    }
}
