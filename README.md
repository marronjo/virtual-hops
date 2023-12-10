## Virtual Hops

### Problem 1
There are missing CCIP lanes available between select EVM chains

![Mainnet Lanes](img/Mainnet%20Missing%20Lanes.png)

![Testnet Lanes](img/Testnet%20Missing%20Lanes.png)

How can we unlock interoperability between chains where no lane currently exists ?

### Problem 2
How can we optimize CCIP lane costs and find the cheapest path between 2 chains ?

![Cheapest Path](img/Cheapest%20Path.png)
### Solution
Introducing '**Virtual Hops**' the one-stop solution for creating virtual CCIP lanes to interconnect EVM chains with ease.

### How does it work ?
Create a bouncer contract in between source and destination chains, using 2 existing CCIP Lanes.  

*Example : BASE Goerli -> AVAX Fuji via ETH Goerli*
 
![Virtual Testnet Lane](img/Virtual%20Lane.png)

### How to ...

#### Install Dependencies
Frontend : `cd frontend && npm install`   
Foundry : [Installation Guide](https://book.getfoundry.sh/getting-started/installation)

#### Test
`forge test`   
`forge coverage`   

#### Deploy
`forge script script/VirtualHop.s.sol:VirtualHopScript --private-key $PRIVATE_KEY --rpc-url $RPC_URL --broadcast`

#### Possible Errors
`error: a value is required for '--private-key <RAW_PRIVATE_KEY>' but none was supplied`   
How to Fix :   
`source .env`   
