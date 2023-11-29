const ethers = require('ethers');
const Fee = require('./out/Fee.sol/Fee.json');
require('dotenv').config();

//excluding ETH Sepolia
const chainSelectors = [
    '2664363617261496610',   
    '12532609583862916517',
    '14767482510784806043',
    '13264668187771770619',
    '5790810961207155433'
]

async function main(){
    var provider = new ethers.providers.JsonRpcProvider(process.env.API_KEY);

    const feeContract = new ethers.Contract(
        '0x46eF928f553Aa7B1158C5A93aD90b4284D6be969',
        Fee.abi,
        provider
    );

    for(const chainSelector of chainSelectors) {
        let fee = await feeContract.getFee(chainSelector);
        let etherValue = ethers.utils.formatEther(fee);
        console.log(etherValue);
    }
}

main();
