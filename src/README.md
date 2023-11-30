`Fee.sol`

Current Deployed Addresses 

ETH Sepolia - 0xc2575DFc9a9487E3d5a58288A292d1f068A4e5bb      
Optimism Goerli - 0x45776686c138e782Fb9ea26FFd54A6C3EAAbf677  
Polygon Mumbai - 0xA52CB4d41bB098BaC3011664D6a4aA740057948f  
Avalanche Fuji - 0xadD2970aAbA4814E572f39c041b3DE04DC9278c3     
BNB Testnet -  
Base Testnet -  

ABI can be found in directory `out/Fee.sol/Fee.json`

External Method : getFee(uint64 chainSelector) returns(uint256)

**Note** chainSelector refers to destination chain.

Chain Selector for each chain can be found [here](https://docs.chain.link/ccip/supported-networks/testnet)

ETH Sepolia - 16015286601757825753  
Optimism Goerli - 2664363617261496610  
Polygon Mumbai - 12532609583862916517  
Avalanche Fuji - 14767482510784806043     
BNB Testnet - 13264668187771770619  
Base Testnet - 5790810961207155433  


### Example :
Call getFee method on deployed contract `0xc2575DFc9a9487E3d5a58288A292d1f068A4e5bb`
with chain selector `2664363617261496610`

returns: uint256 representation of fee to transfer 1 CCIP BnM token from ETH Sepolia to Optimism Goerli

