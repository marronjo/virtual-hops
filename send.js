const ethers = require('ethers');
const VirtualHop = require('./out/VirtualHop.sol/VirtualHop.json');
require('dotenv').config();

let config = {
    "ETH": {
        "rpcUrl": process.env.API_KEY_ETH,
        "contractAddress": "0x6402A29ab5078051f877Bc0Fae9fCf97d9fD2C91",
        "chainSelector": "16015286601757825753",
        "contractInstance": null
    },
    "AVAX": {
        "rpcUrl": process.env.API_KEY_AVAX,
        "contractAddress": "0xe2eD378424E253a72806ea2679974BceAd06240d",
        "chainSelector": "14767482510784806043",
        "contractInstance": null
    },
    "OP": {
        "rpcUrl": process.env.API_KEY_OP,
        "contractAddress": "0x5927Cf4E7BfA12193034BADAB942578EEBC4CcFB",
        "chainSelector": "2664363617261496610",
        "contractInstance": null
    },
    "POL": {
        "rpcUrl": process.env.API_KEY_POLYGON,
        "contractAddress": "0x7F0ba30A1c9075Cd44a90Dd842BBd0857dd37cc4",
        "chainSelector": "12532609583862916517",
        "contractInstance": null
    },
    "BNB": {
        "rpcUrl": process.env.API_KEY_BNB,
        "contractAddress": "0xd7deb4959a13999a431D84A7087b53d7bBD8bb80",
        "chainSelector": "13264668187771770619",
        "contractInstance": null
    },
    "BASE": {
        "rpcUrl": process.env.API_KEY_BASE,
        "contractAddress": "0x9fB0250FDf3347653723772765043b44bF679163",
        "chainSelector": "5790810961207155433",
        "contractInstance": null
    }
}

for(const[key, value] of Object.entries(config)){
    let provider =  new ethers.providers.JsonRpcProvider(value.rpcUrl);
    let signer = new ethers.Wallet(process.env.PRIVATE_KEY,provider);
    let contract = new ethers.Contract(
        value.contractAddress,
        VirtualHop.abi,
        signer
    );
    value.contractInstance = contract;
}

// SendMessage
//
// uint64 chainSelector, 
// address receiver,
// uint256 amount,
// uint256 gasLimit,
// uint64 destinationChainSelector,
// address destinationReceiver

async function sendHop(source, hop, destination, amount, receiver, gasLimit){
    let sourceContract = config[source].contractInstance;
    let hopConfig = config[hop];
    let output = await sourceContract.SendMessage(
        hopConfig.chainSelector,
        hopConfig.contractAddress,
        amount,
        gasLimit,
        config[destination].chainSelector,
        receiver
    );
    console.log("Transaction Hash : %s", output["hash"]);
}

sendHop("BNB", "AVAX", "BASE", "100", "0x3e62Dff1cb16F2902BC7E7400d611cCfc1368981", "500000");