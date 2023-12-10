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
