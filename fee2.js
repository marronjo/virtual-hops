const ethers = require('ethers');
const Fee = require('./out/Fee.sol/Fee.json');
require('dotenv').config();

const chainConfigs = [
    {
        "name": "ETH",
        "deployedContract": "0xc2575DFc9a9487E3d5a58288A292d1f068A4e5bb",
        "chainSelector": "16015286601757825753",
        "rpcEndpoint": process.env.API_KEY_ETH
    },
    {
        "name": "OP",
        "deployedContract": "0x45776686c138e782Fb9ea26FFd54A6C3EAAbf677",
        "chainSelector": "2664363617261496610",
        "rpcEndpoint": process.env.API_KEY_OPTIMISM
    },
    {
        "name": "POL",
        "deployedContract": "0xA52CB4d41bB098BaC3011664D6a4aA740057948f",
        "chainSelector": "12532609583862916517",
        "rpcEndpoint": process.env.API_KEY_POLYGON
    },
    {
        "name": "AVAX",
        "deployedContract": "0xadD2970aAbA4814E572f39c041b3DE04DC9278c3",
        "chainSelector": "14767482510784806043",
        "rpcEndpoint": process.env.API_KEY_AVAX
    }
    ,
    {
        "name": "BASE",
        "deployedContract": "0x45776686c138e782fb9ea26ffd54a6c3eaabf677",
        "chainSelector": "5790810961207155433",
        "rpcEndpoint": process.env.API_KEY_BASE
     }
     ,
    {
        "name": "BNB",
        "deployedContract": "0x45776686c138e782fb9ea26ffd54a6c3eaabf677",
        "chainSelector": "13264668187771770619",
        "rpcEndpoint": process.env.API_KEY_BNB
    }
]

//excluding ETH Sepolia
//if sepolia chain selector is sent to sepolia router, it will throw error!
const chainSelectors = [
    '16015286601757825753',
    '2664363617261496610',
    '12532609583862916517',
    '14767482510784806043',
    '13264668187771770619',
    '5790810961207155433'
]

const destinationAddress = '0xb592b6313f005Ade818FcdE0f64bc42AB23eD700';    //random address to send tokens to
const amount = Math.pow(10,18).toString();                                  //1ether 10**18

async function main(){
    var provider = new ethers.providers.JsonRpcProvider(process.env.API_KEY_ETH);

    const feeContractSepolia = new ethers.Contract(
        '0xc2575DFc9a9487E3d5a58288A292d1f068A4e5bb',
        Fee.abi,
        provider
    );

    for(const chainSelector of chainSelectors) {
        let fee = await feeContractSepolia.getFee(chainSelector, amount, destinationAddress);
        let etherValue = ethers.utils.formatEther(fee);
        console.log(etherValue);
    }
}

async function getAllFees(){
    let allFees = []
    for(const chainConfig of chainConfigs){
        var provider = new ethers.providers.JsonRpcProvider(chainConfig.rpcEndpoint);

        const feeContract = new ethers.Contract(
            chainConfig.deployedContract,
            Fee.abi,
            provider
        );

        let fees = await getFeeX(feeContract, chainConfig.name);
        allFees.push(fees);
    }
return allFees;
}

async function getFeeX(contract, network){
    let fees = [];
    for(const chainConfig of getOtherChainConfigs(network)) {
        // console.log(">>>checking Network: ",network)
        let fee=null
        try {
        fee = await contract.getFee(chainConfig.chainSelector, amount, destinationAddress);
        } catch(err){
            // console.log("error: ",err);
            console.log("no connection",network," -> ",chainConfig.name);
        }
        if (fee != null){
        let etherValue = ethers.utils.formatEther(fee);
        console.log('%s\t ->\t %s\t : %f', network, chainConfig.name, etherValue);
                let out = {"network":network, "chainName":chainConfig.name, "etherValue":etherValue}
        fees.push(out);}
    }
    return fees;
}

async function getFee(contract, network){
    let fees = [];
    for(const chainConfig of getOtherChainConfigs(network)) {
        let fee = await contract.getFee(chainConfig.chainSelector, amount, destinationAddress);
        let etherValue = ethers.utils.formatEther(fee);
        console.log('%s\t ->\t %s\t : %f', network, chainConfig.name, etherValue);
        fees.push(etherValue);
    }
    return fees;
}

//Get chain config for every network except 'network'
function getOtherChainConfigs(network){
    let configs = []
    for(const chainConfig of chainConfigs){
        if(network != chainConfig.name){
            configs.push(chainConfig);
        }
    }
    return configs;
}

//main();

//getAllFees();

module.exports = {getAllFees};