import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import './App.css';
import contract from './contracts/NFTCollectible.json';

const contractAddress = '0x7Ed806E40A743071d738b324DeE0D5B0a43E9fFE';
const abi = contract.abi;

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const checkWalletIsConnected = async () => {
    const { ethereum } = window;
  
    if (!ethereum) {
      console.log('Make sure you have MetaMask installed!');
      return;
    } else {
      console.log("Walletを持っているのだ");
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account: ', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;
  
    if (!ethereum) {
      alert('Please install MetaMask!');
    }
  
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Accountが接続されたのだ: ', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);
  
        console.log('Initialize payment');
        let nftTxn = await nftContract.mintNFTs(1, {
          value: ethers.utils.parseEther('0.01'),
        });
  
        console.log('Mining... please wait');
        await nftTxn.wait();
  
        console.log(`Mined, see transaction: ${nftTxn.hash}`);
      } else {
        console.log('Ethereum object does not exist');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const connectWalletButton = () => {
    return (
      <button
        onClick={connectWalletHandler}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    );
  };

  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className="cta-button mint-nft-button">
        Mint NFT
      </button>
    );
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <div className="main-app">
      <h1>Scrappy Squirrels Tutorial</h1>
      <div>{currentAccount ? mintNftButton() : connectWalletButton()}</div>
    </div>
  );
}

export default App;