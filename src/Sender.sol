// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

abstract contract Sender {

    IRouterClient router;
    address immutable linkToken;

    event MessageSent(bytes32 messageId);

    constructor(address _router, address _link){
        router = IRouterClient(_router);
        linkToken = _link;
    }

    function _sendMessage(
        uint64 _destinationChainSelector,
        address _receiver,
        address _token,
        uint256 _amount,
        address _feeToken,
        string memory _data
    ) internal returns (bytes32) {
        Client.EVM2AnyMessage memory message = _createCCIPMessage(
            _receiver,
            _data,
            _token,
            _amount,
            _feeToken
        );

        uint256 fee = router.getFee(
            _destinationChainSelector,
            message
        );

        require(fee <= IERC20(_feeToken).balanceOf(address(this)));

        IERC20(_feeToken).approve(address(router), fee);
        IERC20(_token).approve(address(router), _amount);

        bytes32 messageId = router.ccipSend(_destinationChainSelector, message);

        emit MessageSent(messageId);

        return messageId;
    }

    function _createCCIPMessage(
        address _receiver,
        string memory _data,
        address _token,
        uint256 _amount,
        address _feeTokenAddress
    ) internal pure returns (Client.EVM2AnyMessage memory) {
        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        Client.EVMTokenAmount memory tokenAmount = Client.EVMTokenAmount({
            token: _token,
            amount: _amount
        });
        tokenAmounts[0] = tokenAmount;

        Client.EVM2AnyMessage memory ccipMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(_receiver),
            data: abi.encode(_data),
            extraArgs: "",
            tokenAmounts: tokenAmounts,
            feeToken: _feeTokenAddress
        });

        return ccipMessage;
    }
}