import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Custom CSS for styling
import useMetamask from './useMetamask'; // Import the custom hook
const ethers = require('ethers');
const VirtualHop = require('./VirtualHopV3.sol/VirtualHopV3.json');

function App() {
  const [selectedChain, setSelectedChain] = useState('AVAX');
  const [amount, setAmount] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [optimalPathData, setOptimalPathData] = useState(null);
  const [optimizing, setOptimizing] = useState(false);
  
  // Use the custom hook to handle Metamask connection and network information
  const {
    metamaskConnected,
    walletAddress,
    networkInfo,
    connectMetamask,
  } = useMetamask();

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
        "chainSelector": "12532609583862916517",
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

  // for(const[key, value] of Object.entries(config)){
  //     let provider =  new ethers.providers.JsonRpcProvider(value.rpcUrl);
  //     let signer = new ethers.Wallet(process.env.PRIVATE_KEY,provider);
  //     let contract = new ethers.Contract(
  //         value.contractAddress,
  //         VirtualHop.abi,
  //         signer
  //     );
  //     value.contractInstance = contract;
  // }

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

async function sendMultiHop(contract, source, hops, receiver, amount, gasLimit){
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
      const response = await fetch('http://localhost:3048/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start: networkInfo.networkName.split(' ')[0], // Source chain abbreviation
          stop: selectedChain, // Destination chain abbreviation
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setOptimalPathData(data); // Update state with optimal path data
    } catch (error) {
      console.error('Error optimizing path:', error);
      // Handle error scenarios here
    } finally {
      setOptimizing(false);
    }
  };

  const handleSubmit = () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
  
    const optimalPathArray = optimalPathData.optimalPath.split(">").slice(1);;
  
    // Get the current chain from metamask
    const sourceChain = networkInfo.networkName.split(' ')[0]
    let chainConfig = config[sourceChain];

    let contract = new ethers.Contract(
      chainConfig.contractAddress,
      VirtualHop.abi,
      signer
    );

    const gasLimit = 1000000;

    console.log("Submitting transaction on ", sourceChain, ", router contract ", chainConfig.contractAddress, ", dest addr ", destinationAddress, ", amount ", amount)
    console.log("Hop array ", optimalPathArray)

    // Sending the multi-hop transaction using the optimal path
    sendMultiHop(contract, sourceChain, optimalPathArray, destinationAddress, amount, gasLimit);

  };

  const handleConnectMetamask = () => {
    connectMetamask();
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container">
          <span className="navbar-brand">Virtual Hops</span>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <p className="nav-link">
                  Status: {metamaskConnected ? 'Connected' : 'Not Connected'}
                  {!metamaskConnected && (
                    <button className="btn btn-primary" onClick={handleConnectMetamask}>
                      Connect Metamask
                    </button>
                  )}
                </p>
              </li>
              {networkInfo && (
                <li className="nav-item">
                  <p className="nav-link">
                    {networkInfo.networkName} (ID: {networkInfo.chainID})
                  </p>
                </li>
              )}
              {walletAddress && (
                <li className="nav-item">
                  <p className="nav-link">Address: {walletAddress}</p>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="form-container">
          <div className="form-group">
            <label htmlFor="chainSelect" className="form-label">
              Destination Chain:
            </label>
            <select
              id="chainSelect"
              className="form-control"
              onChange={handleChainChange}
              value={selectedChain}
            >
              <option value="AVAX">Avalanche (Fuji testnet)</option>
              <option value="OP">Optimism (Goerli testnet)</option>
              <option value="BASE">Base (Goerli testnet)</option>
              <option value="ETH">Ethereum (Sepolia testnet)</option>
              <option value="BNB">Binance Smart Chain (BNB Chain testnet)</option>
              <option value="MUMBAI">Polygon (Mumbai testnet)</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="amountInput" className="form-label">
              Enter Amount:
            </label>
            <input
              type="number"
              id="amountInput"
              className="form-control"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
            />
          </div>
          <div className="form-group">
            <label htmlFor="destinationInput" className="form-label">
              Destination Address:
            </label>
            <input
              type="text"
              id="destinationInput"
              className="form-control"
              value={destinationAddress}
              onChange={handleDestinationChange}
              placeholder="Enter destination address"
            />
          </div>
          <div>
            <button className="btn btn-primary" onClick={handleOptimize}>
                Optimize
            </button>
          </div>
          {optimalPathData && optimalPathData.status === 'ok' && (
            <div>
              <p>Optimal Path: {optimalPathData.optimalPath}</p>
              <p>Cost: {optimalPathData.cost}</p>
            </div>
          )}
          {optimizing ? <p>Optimizing...</p> : null}
          <div>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
