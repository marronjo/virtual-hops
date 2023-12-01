`Fee.sol`

Current Deployed Addresses 

ETH Sepolia - 0xc2575DFc9a9487E3d5a58288A292d1f068A4e5bb [block explorer]()      
Optimism Goerli - 0x45776686c138e782Fb9ea26FFd54A6C3EAAbf677  
Polygon Mumbai - 0xA52CB4d41bB098BaC3011664D6a4aA740057948f  
Avalanche Fuji - 0xadD2970aAbA4814E572f39c041b3DE04DC9278c3     
BNB Testnet -  
Base Testnet Goerli -  0x45776686c138e782fb9ea26ffd54a6c3eaabf677

ABI can be found in directory `out/Fee.sol/Fee.json`

External Method : getFee(uint64 chainSelector) returns(uint256)

**Note** chainSelector refers to destination chain.

Chain Selector for each chain can be found [here](https://docs.chain.link/ccip/supported-networks/testnet)

ETH Sepolia - 16015286601757825753  
Optimism Goerli - 2664363617261496610  
Polygon Mumbai - 12532609583862916517  
Avalanche Fuji - 14767482510784806043     
BNB Testnet - 13264668187771770619  
Base Testnet Goerli - 5790810961207155433  


### Example :
Call getFee method on deployed contract `0xc2575DFc9a9487E3d5a58288A292d1f068A4e5bb`
with chain selector `2664363617261496610`

returns: uint256 representation of fee to transfer 1 CCIP BnM token from ETH Sepolia to Optimism Goerli

## Sample Output 

ETH	    ->	    OP	     :      0.22951437691453636  
AVAX	->	    ETH	     :      0.2615557245451515  
POL	    ->	    ETH	     :      0.2599569380054464  
AVAX	->	    OP	     :      0.22951437691453636  
OP	    ->	    ETH	     :      0.2619951757814464  
ETH	    ->	    POL	     :      0.07704943244438013  
POL	    ->	    OP	     :      0.1537206684606844  
AVAX	->	    POL	     :      0.07706286747424805  
OP	    ->	    POL	     :      0.13847551751665557  
ETH	    ->	    AVAX	 :      0.11062031384615384  
POL	    ->	    AVAX	 :      0.11062031384615384  
OP	    ->	    AVAX	 :      0.11062031384615384  

