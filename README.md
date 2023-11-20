## Virtual Hops

### Problem
There are limited CCIP lanes available between select EVM chains, as shown below.   

![Testnet Lanes](img/Testnet%20Lanes.png)

How can we unlock interoperability between chains where no lane currently exists ?

![Missing Testnet Lanes](img/Missing%20Testnet%20Lanes.png)

### Solution
Introducing '**Virtual Hops**' the one-stop solution for creating virtual CCIP lanes to interconnect EVM chains with ease.

### How does it work ?
Create a bouncer contract in between source and destination chains, using 2 existing CCIP Lanes.  

*Example : BASE Goerli -> AVAX Fuji via ETH Goerli*
 
![Virtual Testnet Lane](img/Virtual%20Lane.png)

Intro to Foundry :  
https://book.getfoundry.sh/