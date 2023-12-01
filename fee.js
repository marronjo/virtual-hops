const ethers = require('ethers');
const Fee = require('./out/Fee.sol/Fee.json');
require('dotenv').config();

const chainConfigs = [
    {
        "network": "ETH",
        "deployedContract": "0xc2575DFc9a9487E3d5a58288A292d1f068A4e5bb",
        "chainSelector": "16015286601757825753",
        "rpcEndpoint": process.env.API_KEY_ETH
    },
    {
        "network": "OP",
        "deployedContract": "0x45776686c138e782Fb9ea26FFd54A6C3EAAbf677",
        "chainSelector": "2664363617261496610",
        "rpcEndpoint": process.env.API_KEY_OPTIMISM
    },
    {
        "network": "POL",
        "deployedContract": "0xA52CB4d41bB098BaC3011664D6a4aA740057948f",
        "chainSelector": "12532609583862916517",
        "rpcEndpoint": process.env.API_KEY_POLYGON
    },
    {
        "network": "AVAX",
        "deployedContract": "0xadD2970aAbA4814E572f39c041b3DE04DC9278c3",
        "chainSelector": "14767482510784806043",
        "rpcEndpoint": process.env.API_KEY_AVAX
    },
    {
        "network": "BASE",
        "deployedContract": "0x45776686c138e782fb9ea26ffd54a6c3eaabf677",
        "chainSelector": "5790810961207155433",
        "rpcEndpoint": process.env.API_KEY_BASE
    },
    {
        "network": "BNB",
        "deployedContract": "0x45776686c138e782fb9ea26ffd54a6c3eaabf677",
        "chainSelector": "13264668187771770619",
        "rpcEndpoint": process.env.API_KEY_BNB
    }
]

const destinationAddress = '0xb592b6313f005Ade818FcdE0f64bc42AB23eD700';    //random address to send tokens to
const amount = Math.pow(10,18).toString();                                  //1ether 10**18

function getAllFees(){
    let allFees = []
    for(const chainConfig of chainConfigs){
        var provider = new ethers.providers.JsonRpcProvider(chainConfig.rpcEndpoint);

        const feeContract = new ethers.Contract(
            chainConfig.deployedContract,
            Fee.abi,
            provider
        );

        let fees = getFee(feeContract, chainConfig.network)
        allFees.push(fees);
    }
    return allFees;
}

async function getFee(contract, network){
    let fees = [];
    for(const chainConfig of getOtherChainConfigs(network)) {
        try{
            let fee = await contract.getFee(chainConfig.chainSelector, amount, destinationAddress);
            let etherValue = ethers.utils.formatEther(fee);
        console.log('%s\t ->\t %s\t : %f', network, chainConfig.network, etherValue);
        fees.push(etherValue);
        } catch{
            console.error('missing lane : %s -> %s', network, chainConfig.network)
        }
    }
    return fees;
}

//Get chain config for every network except 'network'
function getOtherChainConfigs(network){
    let configs = []
    for(const chainConfig of chainConfigs){
        if(network != chainConfig.network){
            configs.push(chainConfig);
        }
    }
    return configs;
}

getAllFees();