import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; 
import useMetamask from './useMetamask'; 
const ethers = require('ethers');
const VirtualHop = require('./VirtualHopV3.sol/VirtualHopV3.json');
const Fee = require('./Fee.sol/Fee.json');
let Graph = require("ngraph.graph");
let pathX = require("ngraph.path");

function App() {
  const [selectedChain, setSelectedChain] = useState('AVAX');
  const [amount, setAmount] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [optimalPathData, setOptimalPathData] = useState(null);
  const [optimizing, setOptimizing] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Use the custom hook to handle Metamask connection and network information
  const {
    metamaskConnected,
    walletAddress,
    networkInfo,
    connectMetamask,
  } = useMetamask();

  const chainConfigs = [
    {
        "name": "ETH",
        "deployedContract": "0xc2575DFc9a9487E3d5a58288A292d1f068A4e5bb",
        "chainSelector": "16015286601757825753",
        "rpcEndpoint": process.env.REACT_APP_API_KEY_ETH
    },
    {
        "name": "OP",
        "deployedContract": "0x45776686c138e782Fb9ea26FFd54A6C3EAAbf677",
        "chainSelector": "2664363617261496610",
        "rpcEndpoint": process.env.REACT_APP_API_KEY_OPTIMISM
    },
    {
        "name": "POL",
        "deployedContract": "0xA52CB4d41bB098BaC3011664D6a4aA740057948f",
        "chainSelector": "12532609583862916517",
        "rpcEndpoint": process.env.REACT_APP_API_KEY_POLYGON
    },
    {
        "name": "AVAX",
        "deployedContract": "0xadD2970aAbA4814E572f39c041b3DE04DC9278c3",
        "chainSelector": "14767482510784806043",
        "rpcEndpoint": process.env.REACT_APP_API_KEY_AVAX
    }
    ,
    {
        "name": "BASE",
        "deployedContract": "0x45776686c138e782fb9ea26ffd54a6c3eaabf677",
        "chainSelector": "5790810961207155433",
        "rpcEndpoint": process.env.REACT_APP_API_KEY_BASE
     }
     ,
    {
        "name": "BNB",
        "deployedContract": "0x45776686c138e782fb9ea26ffd54a6c3eaabf677",
        "chainSelector": "13264668187771770619",
        "rpcEndpoint": process.env.REACT_APP_API_KEY_BNB
    }
]

  let config = {
    "ETH": {
        "contractAddress": "0xFBDa4aE0b526087b788b6864Cb4eA7e5f113f652",
        "chainSelector": "16015286601757825753"
    },
    "AVAX": {
        "contractAddress": "0xAA911f9d1eDAECA499678FbF12bBAbb96A128687",
        "chainSelector": "14767482510784806043"
    },
    "OP": {
        "contractAddress": "0x50d00480D383Fd9846fe4419C0288c469DbdCd8E",
        "chainSelector": "2664363617261496610"
    },
    "POL": {
        "contractAddress": "0x1EC90Af34556A0F5f41A0F7699e56F556c7ed172",
        "chainSelector": "12532609583862916517"
    },
    "BNB": {
        "contractAddress": "0x803B135CC4b0f9576e6299e8E1917ffA5BfC33C6",
        "chainSelector": "13264668187771770619"
    },
    "BASE": {
        "contractAddress": "0xD18b5c54376B1998a8e2a8f9aF957F7A2D5f005E",
        "chainSelector": "5790810961207155433"
    }
  }

  const getChainById = new Map([
    ['11155111', 'ETH'],
    ['43113', 'AVAX'],
    ['420', 'OP'],
    ['80001', 'POL'],
    ['97', 'BNB'],
    ['84531', 'BASE']
  ]);

  let lastFeeCheckTime = 0
  const feeCheckInterval = 120000

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
  
  //Get chain config for every network except 'network'
  function getOtherChainConfigs(network){
    let configs = []
    for(const chainConfig of chainConfigs){
        if(network !== chainConfig.name){
            configs.push(chainConfig);
        }
    }
    return configs;
  }

  function createHopList(hops, receiver){
      let hopList = [];
      for(const hop of hops){
          console.log("Adding hop: ", hop)
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

  async function sendMultiHop(contract, hops, receiver, amount, gasLimit){
      let hopList = createHopList(hops, receiver);

      let output = await contract.sendMessage(
          amount,
          gasLimit,
          hopList,
          {
              gasLimit: "1000000"
          }
      );
      console.log("Transaction Hash : %s", output["hash"]);

      return output["hash"]
  }

  let feeDict = new Map();
  let allFees = []

  async function createGraph() {
    let timeSinceLastCheck = Date.now() - lastFeeCheckTime
    console.log("Time since last check: ", timeSinceLastCheck)
    if (timeSinceLastCheck > feeCheckInterval) {
      allFees = await getAllFees();
      lastFeeCheckTime = Date.now()
    }
    else {
      console.log("Not refreshing fees. They were last retrieved ", timeSinceLastCheck / 1000, " seconds ago")
    }

    // let allFees = feeConst;
    let graph = Graph();
    let graphMeta = [];
    let feeObj = allFees.flat();

    for (const o of feeObj) {
      graph.addLink(o.network, o.chainName, {
        data: o.etherValue,
        weight: o.etherValue,
      });
      graphMeta.push(o);
      feeDict.set(o.network + o.chainName, o.etherValue);
    }

    return { graph, graphMeta };
  }

  async function optimizePath(start, stop){

    let graphStr = await createGraph();

    let pathFinder = pathX.aStar(graphStr.graph, {
      oriented: true,

      distance(fromNode, toNode, link) {
        return parseFloat(link.data.weight);
      },
    });

    let out = pathFinder.find(start, stop);

    console.log("OUT - Optimal connection");

    const result = out
      .reverse()
      .map((obj) => obj.id)
      .join(">");
    console.log(":::::", result);

    let feeForDirPath = 99999;
    let feeForOptPath = [];
    let feeForOptPathSum = 0;

    for (let i = 0; i < out.length - 1; i++) {
      console.log(`price: ${i}`, feeDict.get(out[i].id + out[i + 1].id))
      feeForOptPathSum += parseFloat(feeDict.get(out[i].id + out[i + 1].id))
    }

    console.log(
      "Fee for direct path from " +
      start +
      " to " +
      stop +
      "==" +
      feeForDirPath
    );

    console.log("Fee for opt path " + feeForOptPath);
    console.log("Sum of Fee for opt path " + feeForOptPathSum);

    return({
      status: 'ok',
      optimalPath: result, 
      cost: feeForOptPathSum
    });
  }

  const handleChainChange = (e) => {
    setSelectedChain(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setDestinationAddress(e.target.value);
  };
  
  const handleOptimize = async () => {
    setOptimizing(true);

    try {
      const response = await optimizePath(getChainById.get(networkInfo.chainID), selectedChain);
      setOptimalPathData(response); // Update state with optimal path data
    } catch (error) {
      console.error('Error optimizing path:', error);
      // Handle error scenarios here
    } finally {
      setOptimizing(false);
    }
  };

  const handleSubmit = async () => {
    if (!destinationAddress || !amount) {
      setFormSubmitted(true);
      return; 
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
  
    const optimalPathArray = optimalPathData.optimalPath.split(">").slice(1);;
  
    // Get the current chain from metamask
    // const sourceChain = networkInfo.networkName.split(' ')[0]
    const sourceChain = getChainById.get(networkInfo.chainID)
    let chainConfig = config[sourceChain];

    let contract = new ethers.Contract(
      chainConfig.contractAddress,
      VirtualHop.abi,
      signer
    );

    const gasLimit = 1000000;

    console.log("Submitting transaction on ", sourceChain, ", hop contract ", chainConfig.contractAddress, ", dest addr ", destinationAddress, ", amount ", amount)
    console.log("Hop array ", optimalPathArray)

    // Sending the multi-hop transaction using the optimal path
    const hash = await sendMultiHop(contract, optimalPathArray, destinationAddress, amount, gasLimit);

    setTransactionHash(hash);
  };

  const handleConnectMetamask = () => {
    connectMetamask();
  };

  return (
    <div>
      <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
        <div className="container ">
          <span className="navbar-brand">Virtual Hops</span>
          <ul className="navbar-nav ms-auto align-items-center">
          <li className="nav-item">
              {!metamaskConnected && (
                <button className="btn btn-primary" onClick={handleConnectMetamask}>
                  Connect Metamask
                </button>
              )}
          </li>
          {metamaskConnected && networkInfo && (
            
            <li className="nav-item">
              <a href="/" className="nav-link">
                {networkInfo.networkName !== 'Unknown Network'
                  ? `${networkInfo.networkName}`
                  : `${networkInfo.networkName} (${networkInfo.chainID})`}
              </a>
            </li>
          )}
          {metamaskConnected && walletAddress && (
            <li className="nav-item">
              <a href="/" className="nav-link">{walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}</a>
            </li>
          )}
        </ul>
        </div>
      </nav>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-sm-6">
            <div className="card p-3 mb-5 bg-light text-dark">
              <div className="form-group">
                <label htmlFor="chainSelect" className="form-label">Destination Chain</label>
                <select
                  id="chainSelect"
                  className="form-select"
                  onChange={handleChainChange}
                  value={selectedChain}
                >
                  <option value="AVAX">Avalanche (Fuji testnet)</option>
                  <option value="OP">Optimism (Goerli testnet)</option>
                  <option value="BASE">Base (Goerli testnet)</option>
                  <option value="ETH">Ethereum (Sepolia testnet)</option>
                  <option value="BNB">Binance Smart Chain (BNB Chain testnet)</option>
                  <option value="POL">Polygon (Mumbai testnet)</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="destinationInput" className="form-label">Destination Address</label>
                <input
                  type="text"
                  id="destinationInput"
                  className={`form-control ${formSubmitted && !destinationAddress ? 'is-invalid' : ''}`}
                  value={destinationAddress}
                  onChange={handleDestinationChange}
                  placeholder="Enter destination address"
                  required
                  />
                  <div className="invalid-feedback">
                    Please enter a destination address
                  </div>
              </div>
              <div className="form-group">
                <label htmlFor="amountInput" className="form-label">Amount</label>
                <input
                  type="text"
                  id="amountInput"
                  className={`form-control ${formSubmitted && !amount ? 'is-invalid' : ''}`}
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Enter amount"
                  required // Adding the required attribute for form validation
                />
                <div className="invalid-feedback">
                  Please enter an amount
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-sm-6">
                  <button className="btn btn-primary w-100" onClick={handleOptimize}>
                    Optimize
                  </button>
                </div>
                <div className="col-sm-6">
                  <button className="btn btn-primary w-100" onClick={handleSubmit} disabled={!optimalPathData}>
                    Send
                  </button>
                </div>
              </div>
              {optimalPathData && !optimizing && optimalPathData.status === 'ok' && (
                <div className="card mt-4 p-3">
                  <h5 className="card-title">Optimal Path</h5>
                  <p className="card-text">{optimalPathData.optimalPath}</p>
                  <h5 className="card-title">Cost</h5>
                  <p className="card-text">{optimalPathData.cost}</p>
                </div>
              )}
              {optimizing &&
                <div className="card mt-4 p-3">
                  <h5 className="card-title">Optimizing...</h5>
                </div>
              }
              {transactionHash && (
                <div className="card mt-4 p-3">
                  <h5 className="card-title">Transaction Hash</h5>
                  <p className="card-text">{transactionHash}</p>
                  <a
                    href={`https://ccip.chain.link/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View in CCIP Explorer
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
