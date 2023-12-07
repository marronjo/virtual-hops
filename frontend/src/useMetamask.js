// useMetamask.js

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const useMetamask = () => {
  const [provider, setProvider] = useState(null);
  const [metamaskConnected, setMetamaskConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [networkInfo, setNetworkInfo] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      window.ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts) => {
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setMetamaskConnected(true);
          }
        })
        .catch((err) => {
          console.error('Error fetching accounts: ', err);
        });

      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setMetamaskConnected(true);
        } else {
          setWalletAddress('');
          setMetamaskConnected(false);
        }
      });

      window.ethereum.on('chainChanged', (chainId) => {
        const networkDetails = getNetworkDetails(chainId);
        setNetworkInfo(networkDetails);
      });

      window.ethereum
        .request({ method: 'eth_chainId' })
        .then((chainId) => {
          const networkDetails = getNetworkDetails(chainId);
          setNetworkInfo(networkDetails);
        })
        .catch((err) => {
          console.error('Error fetching chainId: ', err);
        });
    } else {
      console.log('Please install Metamask to use this application');
    }
  }, []);

  useEffect(() => {
    if (provider) {
      const fetchNetwork = async () => {
        try {
          const network = await provider.getNetwork();
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setMetamaskConnected(true);
          } else {
            setWalletAddress('');
            setMetamaskConnected(false);
          }

          const networkDetails = getNetworkDetails(network.chainId.toString());
          setNetworkInfo(networkDetails);
        } catch (error) {
          console.error('Error fetching network: ', error);
        }
      };
      fetchNetwork();
    }
  }, [provider]);


  const getNetworkDetails = (chainId) => {
    let networkName = 'Unknown Network';
    const formattedChainId = chainId.startsWith('0x') ? chainId.slice(2) : chainId;
    
    switch (formattedChainId) {
      case '1':
        networkName = 'ETH Mainnet';
        break;
      case '3':
        networkName = 'ETH Testnet';
        break;
      case '4':
        networkName = 'ETH Testnet';
        break;
      case '5':
        networkName = 'ETH Testnet';
        break;
      case '43114':
        networkName = 'AVAX';
        break;
      case '43113':
        networkName = 'AVAX Fuji';
        break;
      case '420':
        networkName = 'OPT Goerli';
        break;
      case '31337':
        networkName = 'ETH Sepolia';
        break;
      case '97':
        networkName = 'BNB testnet';
        break;
      case '80001':
        networkName = 'MATIC Mumbai';
        break;
      default:
        break;
    }
  
    return { networkName, chainID: formattedChainId };
  };

  const connectMetamask = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setMetamaskConnected(true);
        }
      } else {
        console.log('Metamask not found');
      }
    } catch (error) {
      console.error('Error connecting to Metamask: ', error);
    }
  };

  return {
    provider,
    metamaskConnected,
    walletAddress,
    networkInfo,
    connectMetamask,
  };
};

export default useMetamask;