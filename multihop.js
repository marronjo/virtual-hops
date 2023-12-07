const ethers = require('ethers');
const VirtualHop = require('./out/VirtualHopV3.sol/VirtualHopV3.json');
require('dotenv').config();

let config = {
    "ETH": {
        "rpcUrl": process.env.API_KEY_ETH,
        "contractAddress": "0xFBDa4aE0b526087b788b6864Cb4eA7e5f113f652",
        "chainSelector": "16015286601757825753",
        "contractInstance": null
    },
    "AVAX": {
        "rpcUrl": process.env.API_KEY_AVAX,
        "contractAddress": "0xAA911f9d1eDAECA499678FbF12bBAbb96A128687",
        "chainSelector": "14767482510784806043",
        "contractInstance": null
    },
    "OP": {
        "rpcUrl": process.env.API_KEY_OP,
        "contractAddress": "0x50d00480D383Fd9846fe4419C0288c469DbdCd8E",
        "chainSelector": "2664363617261496610",
        "contractInstance": null
    },
    "POL": {
        "rpcUrl": process.env.API_KEY_POLYGON,
        "contractAddress": "0x1EC90Af34556A0F5f41A0F7699e56F556c7ed172",
        "chainSelector": "12532609583862916517",
        "contractInstance": null
    },
    "BNB": {
        "rpcUrl": process.env.API_KEY_BNB,
        "contractAddress": "0x803B135CC4b0f9576e6299e8E1917ffA5BfC33C6",
        "chainSelector": "13264668187771770619",
        "contractInstance": null
    },
    "BASE": {
        "rpcUrl": process.env.API_KEY_BASE,
        "contractAddress": "0xD18b5c54376B1998a8e2a8f9aF957F7A2D5f005E",
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

function createHopList(hops, receiver){
    let hopList = [];
    for(const hop of hops){
        let networkConfig = config[hop];
        hopList.push(
        {
            chainSelector: networkConfig.chainSelector,
            receiver: networkConfig.contractAddress
        });
    }
    hopList[hopList.length-1].receiver = receiver;
    return hopList;
}

async function sendMultiHop(source, hops, receiver, amount, gasLimit){
    let hopList = createHopList(hops, receiver);
    let sourceContract = config[source].contractInstance;

    let output = await sourceContract.sendMessage(
        amount,
        gasLimit,
        hopList
    );
    console.log("Transaction Hash : %s", output["hash"]);
}

//source = AVAX
//hops = ["BNB", "BASE", "OP", "POL", "ETH"];
//hops = ["BNB", "POL", "ETH"];
// receiver = "0x3e62Dff1cb16F2902BC7E7400d611cCfc1368981";

// 
// console.log(hopList);

//sendMultiHop("AVAX", hops, "0x3e62Dff1cb16F2902BC7E7400d611cCfc1368981", 1000, 1000000);
hops = ["AVAX", "BNB", "AVAX", "POL", "BNB", "AVAX", "POL"];

sendMultiHop("POL", hops, "0x3e62Dff1cb16F2902BC7E7400d611cCfc1368981", 1000, 1000000);
