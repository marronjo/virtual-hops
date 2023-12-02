// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

contract EncodeStruct {

    struct Destination {
        uint64 destinationChainSelector;
        address receiver;
        address token;
        uint256 amount;
        address feeToken;
    }

    bytes public structBytes;

    /**
     * create new Destination struct
     * encode into byte array
     * return byte array
     */
    function encodeStruct() public returns(bytes memory){
        Destination memory destination = Destination(
            16015286601757825753,
            0x779877A7B0D9E8603169DdbD7836e478b4624789,
            0x097D90c9d3E0B50Ca60e1ae45F6A81010f9FB534,
            1e18,
            0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05
        );
        structBytes = abi.encode(destination);
        return structBytes;
    }


    /**
     * decode byte array back into Destination struct
     */
    function decodeStruct() public view returns(Destination memory){
        return abi.decode(structBytes, (Destination));
    }
}