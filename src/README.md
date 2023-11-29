`Fee.sol`

Current Deployed Addresses 

ETH Sepolia - 0x46eF928f553Aa7B1158C5A93aD90b4284D6be969    
Optimism Goerli -   
Polygon Mumbai -  
Avalanche Fuji -    
BNB Testnet -  
Base Testnet -  

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
Call getFee method on deployed contract `0x46eF928f553Aa7B1158C5A93aD90b4284D6be969`
with chain selector `2664363617261496610`

returns: uint256 representation of fee to transfer 1 CCIP BnM token from ETH Sepolia to Optimism Goerli

