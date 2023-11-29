const ethers = require('ethers');
const Fee = require('./out/Fee.sol/Fee.json');
require('dotenv').config();

async function main(){
    var provider = new ethers.providers.JsonRpcProvider(process.env.API_KEY);

    const feeContract = new ethers.Contract(
        '0x46eF928f553Aa7B1158C5A93aD90b4284D6be969',
        Fee.abi,
        provider
    );

    let fee = await feeContract.getFee('2664363617261496610');
    console.log(fee);
}

main();
