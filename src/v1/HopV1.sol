// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

contract HopV1 is CCIPReceiver {

    IRouterClient immutable router;
    address immutable linkToken;
    address immutable bnmToken;

    event MessageHopped(bytes32 messageId);

    struct Destination {
        uint256 param1;
        uint256 param2;
        uint64 chainSelector;
        address receiver;
        uint256 amount;
    }    

    constructor(address _router, address _linkToken, address _bnmToken) CCIPReceiver(_router) {
        router = IRouterClient(_router);
        linkToken = _linkToken;
        bnmToken = _bnmToken;
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        Destination memory destination = abi.decode(message.data, (Destination));
        _sendMessage(destination.chainSelector, destination.receiver, destination.amount);
    }

    function _sendMessage(
        uint64 chainSelector,
        address receiver,
        uint256 amount
    ) internal returns (bytes32) {
        Client.EVM2AnyMessage memory message = _createCCIPMessage(
            receiver,
            "",
            amount
        );

        uint256 fee = router.getFee(
            chainSelector,
            message
        );

        require(fee <= IERC20(linkToken).balanceOf(address(this)));

        IERC20(linkToken).approve(address(router), fee);
        IERC20(bnmToken).approve(address(router), amount);

        bytes32 messageId = router.ccipSend(chainSelector, message);

        return messageId;
    }

    function _createCCIPMessage(
        address _receiver,
        string memory _data,
        uint256 _amount
    ) internal view returns (Client.EVM2AnyMessage memory) {
        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        Client.EVMTokenAmount memory tokenAmount = Client.EVMTokenAmount({
            token: bnmToken,
            amount: _amount
        });
        tokenAmounts[0] = tokenAmount;

        Client.EVM2AnyMessage memory ccipMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(_receiver),
            data: abi.encode(_data),
            extraArgs: "",
            tokenAmounts: tokenAmounts,
            feeToken: linkToken
        });

        return ccipMessage;
    }

    receive() external payable{}
}