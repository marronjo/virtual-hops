// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import {VirtualHop} from "../src/VirtualHop.sol";
import {Vm} from "forge-std/Vm.sol";
import {Config} from "../script/Config.s.sol";
import {VirtualHopScript} from "../script/VirtualHop.s.sol";
import {TokenMock} from "./mock/TokenMock.sol";
import {Sender} from "../src/Sender.sol";

contract VirtualHopTest is Test {
    VirtualHop public virtualHop;
    TokenMock public linkTokenMock;
    TokenMock public bnmTokenMock;

    address private user = makeAddr("user");
    uint256 private constant BALANCE = 1 ether;

    address private testContract = makeAddr("contract");
    uint64 private chainSelector = 12345678;

    uint256 private constant amount = 1000;
    uint256 private constant gasLimit = 500000;

    modifier setMaxBalances() {
        vm.prank(user);
        linkTokenMock.setMaxBalance();
        bnmTokenMock.setZeroBalance();
        _;
    }

    function setUp() public {
        VirtualHopScript virtualHopDeployer = new VirtualHopScript();
        vm.deal(user, BALANCE);
        (virtualHop, linkTokenMock, bnmTokenMock) = virtualHopDeployer.runCustom();
    }

    function createValidHops() private view returns(VirtualHop.Hop[] memory validHops){
        validHops = new VirtualHop.Hop[](2);
        validHops[0] = VirtualHop.Hop(testContract, chainSelector);
        validHops[1] = VirtualHop.Hop(testContract, chainSelector);
    }

    function test_SendMessageHappyPath() public setMaxBalances {
        VirtualHop.Hop[] memory validHops = createValidHops();
        virtualHop.sendMessage(amount, gasLimit, validHops);
    }

    function test_revertSendMessageInsufficientFundsToCoverFee() public {
         vm.prank(user);
        VirtualHop.Hop[] memory validHops = createValidHops();
        linkTokenMock.setZeroBalance();
        vm.expectRevert(Sender.Sender__InsufficientFundsToCoverFee.selector);
        virtualHop.sendMessage(amount, gasLimit, validHops);
    }

    function test_revertSendMessageApproveRouterLinkSpend() public setMaxBalances {
        VirtualHop.Hop[] memory validHops = createValidHops();
        linkTokenMock.setApproveFailed();
        vm.expectRevert(Sender.Sender__ApproveRouterLinkSpend.selector);
        virtualHop.sendMessage(amount, gasLimit, validHops);
    }

    function test_revertSendMessageApproveRouterBnmSpend() public setMaxBalances {
        VirtualHop.Hop[] memory validHops = createValidHops();
        bnmTokenMock.setApproveFailed();
        vm.expectRevert(Sender.Sender__ApproveRouterBnmSpend.selector);
        virtualHop.sendMessage(amount, gasLimit, validHops);
    }

    function test_revertNextHopEmptySendMessage() public {
        vm.prank(user);
        VirtualHop.Hop[] memory emptyHops = new VirtualHop.Hop[](0);
        vm.expectRevert(VirtualHop.VirtualHop__NextHopEmpty.selector);
        virtualHop.sendMessage(amount, gasLimit, emptyHops);
    }
}