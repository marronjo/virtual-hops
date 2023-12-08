web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
var account;
web3.eth.getAccounts().then(console.log);
web3.eth.getAccounts().then((f) => {
 account = f[0];
});
myContract = new web3.eth.Contract(
	[
		{
			"constant": false,
			"inputs": [
				{
					"internalType": "uint8",
					"name": "idx",
					"type": "uint8"
				},
				{
					"internalType": "int16",
					"name": "newRate",
					"type": "int16"
				}
			],
			"name": "registerRate",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "date1",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"internalType": "uint8",
					"name": "idx",
					"type": "uint8"
				}
			],
			"name": "getRate",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "_result",
					"type": "uint256"
				},
				{
					"internalType": "uint16",
					"name": "_counter",
					"type": "uint16"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		}
	]

);
myContract.options.address = "0x56fe7a7a706738738d0ffacd7ea48fd2285e0d42"; 

function populateRate(bID){
  let r	;
  let newRate=$("#rate-"+bID).val();
  if(validateRate(newRate)==1){
	  r=parseInt(newRate*100);
	  console.log(r);

	 myContract.methods.registerRate(bID-1,parseInt(r)).send({from: account}).then((result2) => {
	 	console.log(result2);
	 	myContract.methods.getRate(bID-1).call().then(function(result1)  {
	 		updateOneRate(bID,result1["_result"]/1000000,result1["_counter"]);
	 		})
	.catch((e)=>{
		console.log("no result for: " + (bID) + " " + e);

	})
	 })
	 .catch((e)=>{
		 alert("error when updating: "+r);
	 	console.log(e);
	 	return;
	 })
  }
  else {
	  alert("Rate must be in a range from -25 to +50!");
	  
  }

}


function subRate(bID){

	let id=parseInt(bID.charAt(bID.length-1));

	populateRate(id);
}

function updateOneRate(id,rate1,c1){
	nf=Intl.NumberFormat('en-US', {minimumFractionDigits: 3});
	$("#no-"+id).text(c1);
	$("#avg-"+id).text(nf.format(rate1,));

}


$(document).ready(function() {
	//read rates for all 3 rates
	
	for(let i=0; i < 3; i++) {
	
	console.log("starting: "+i);	
	myContract.methods.getRate(i).call().then(function(result1)  {
		console.log(result1);
		updateOneRate((i+1),result1["_result"]/1000000,result1["_counter"]);
		console.log("suc:"+i);
	})
	.catch((e)=>{
		console.log("no result for: " + (i+1) + " " + e);
		console.log("fail:"+i);
	})
}
})
function validateRate(x) {
  var x, result;

  if (isNaN(x) || x < -50 || x > 50) {
    return 0;
  } else {
    return 1;
  }
}



