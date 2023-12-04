// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {SendV1} from "../src/v1/SendV1.sol";
import {Config} from "./Config.s.sol";

contract SendV1Script is Script {
    function setUp() public {}

    function run() public returns (SendV1) {
        Config config = new Config();
        (
            address router,
            address linkToken,
            address bnmToken
        ) = config.networkConfig();

        vm.startBroadcast();
        SendV1 test = new SendV1(router, linkToken, bnmToken);
        vm.stopBroadcast();

        return test;
    }
}
