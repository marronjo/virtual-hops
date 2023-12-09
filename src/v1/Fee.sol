// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

contract Fee {

    IRouterClient router;
    address immutable linkToken;
    address immutable transferToken;

     constructor(address _router, address _link, address _transferToken){
        router = IRouterClient(_router);
        linkToken = _link;
        transferToken = _transferToken;
    }

    function getFee(uint64 chainSelector, uint256 amount, address destination) external view returns(uint256 fee) {
        Client.EVM2AnyMessage memory message = _createCCIPMessage(
            destination, //random address
            "",
            transferToken,
            amount,
            linkToken //LINK token to pay fees
        );
        
        fee = router.getFee(
            chainSelector,
            message
        );
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