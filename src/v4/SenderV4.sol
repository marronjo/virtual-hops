// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

abstract contract SenderV4 {

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
    ) internal returns (bytes32 messageId) {
        (Client.EVM2AnyMessage memory message, uint256 fee) = _getFeeMessage(
            chainSelector,
            receiver,
            amount,
            gasLimit,
            data
        );

        require(fee <= IERC20(linkToken).balanceOf(address(this)));

        IERC20(linkToken).approve(address(router), fee);
        IERC20(bnmToken).approve(address(router), amount);

        messageId = router.ccipSend(chainSelector, message);
    }

    function _getFeeMessage(
        uint64 chainSelector,
        address receiver,
        uint256 amount,
        uint256 gasLimit,
        bytes memory data
    ) internal view returns(Client.EVM2AnyMessage memory message, uint256 fee){
        message = _createCCIPMessage(
            receiver,
            data,
            amount,
            gasLimit
        );

        fee = router.getFee(
            chainSelector,
            message
        );
    }

    function _createCCIPMessage(
        address _receiver,
        bytes memory _data,
        uint256 _amount,
        uint256 gasLimit
    ) private view returns (Client.EVM2AnyMessage memory message) {
        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        Client.EVMTokenAmount memory tokenAmount = Client.EVMTokenAmount({
            token: bnmToken,
            amount: _amount
        });
        tokenAmounts[0] = tokenAmount;

        Client.EVMExtraArgsV1 memory evmExtraArgs = Client.EVMExtraArgsV1(gasLimit, false);

        message = Client.EVM2AnyMessage({
            receiver: abi.encode(_receiver),
            data: _data,
            extraArgs: Client._argsToBytes(evmExtraArgs),
            tokenAmounts: tokenAmounts,
            feeToken: linkToken
        });
    }
}
