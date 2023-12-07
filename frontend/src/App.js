import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Custom CSS for styling
import useMetamask from './useMetamask'; // Import the custom hook

function App() {
  const [selectedChain, setSelectedChain] = useState('AVAX');
  const [amount, setAmount] = useState('');
  
  // Use the custom hook to handle Metamask connection and network information
  const {
    metamaskConnected,
    walletAddress,
    networkInfo,
    connectMetamask,
  } = useMetamask();

  const handleChainChange = (e) => {
    setSelectedChain(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };
  
  const handleOptimize = () => {
    // Logic for optimizing
    // ...
  };

  const handleSubmit = () => {
    // Do something useful here
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
              <option value="BASE">xDai (Goerli testnet)</option>
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
          <div>
            <button className="btn btn-primary" onClick={handleOptimize}>
                Optimize
            </button>
          </div>
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
