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

const destinationAddress = '0xb592b6313f005Ade818FcdE0f64bc42AB23eD700';
const amount = Math.pow(10,18).toString(); //1ether 10**18

async function main(){
    var provider = new ethers.providers.JsonRpcProvider(process.env.API_KEY);

    const feeContract = new ethers.Contract(
        '0xc2575DFc9a9487E3d5a58288A292d1f068A4e5bb',
        Fee.abi,
        provider
    );

    for(const chainSelector of chainSelectors) {
        let fee = await feeContract.getFee(chainSelector, amount, '0xb592b6313f005Ade818FcdE0f64bc42AB23eD700');
        let etherValue = ethers.utils.formatEther(fee);
        console.log(etherValue);
    }
}

main();

/*

Current output :

0.092182212079807507
0.077066772353805518
0.110620313846153846    //very expensive!
0.016954584615384615
0.00155580907514299     //tiny fee

*/