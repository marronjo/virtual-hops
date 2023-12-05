// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

abstract contract Sender {

    IRouterClient immutable router;
    address immutable linkToken;
    address immutable bnmToken;

    constructor(address _router, address _link, address _bnmToken){
        router = IRouterClient(_router);
        linkToken = _link;
        bnmToken = _bnmToken;
    }

    function _sendMessage(
        uint64 chainSelector,
        address receiver,
        uint256 amount,
        uint256 gasLimit,
        bytes memory data
    ) internal returns (bytes32) {
        Client.EVM2AnyMessage memory message = _createCCIPMessage(
            receiver,
            data,
            amount,
            gasLimit
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
        bytes memory _data,
        uint256 _amount,
        uint256 gasLimit
    ) private view returns (Client.EVM2AnyMessage memory) {
        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        Client.EVMTokenAmount memory tokenAmount = Client.EVMTokenAmount({
            token: bnmToken,
            amount: _amount
        });
        tokenAmounts[0] = tokenAmount;

        //add custom gas limit for ccipReceive function on intermediary chain.
        //set strict sequencing to false, to allow failed messages to be overtaken and not block newer messages.
        Client.EVMExtraArgsV1 memory evmExtraArgs = Client.EVMExtraArgsV1(gasLimit, false);

        Client.EVM2AnyMessage memory ccipMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(_receiver),
            data: _data,
            extraArgs: Client._argsToBytes(evmExtraArgs),
            tokenAmounts: tokenAmounts,
            feeToken: linkToken
        });

        return ccipMessage;
    }
}
