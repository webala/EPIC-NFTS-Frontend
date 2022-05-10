import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, {useEffect, useState} from "react";

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {

  const [currentAccount, setCurrentAccount] = useState()

  const getEthereum = () => {
    try {
      const {ethereum} = window
      if (ethereum) {
        //alert("Get MetaMask!");
        return ethereum;
      }else {
        return null
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfWalletIsConnected = async () => {
   
    if (!getEthereum) {
      console.log('No ethereum') 
    } else {
      const ethereum = getEthereum()
      console.log('We have etherium')
      const accounts = await ethereum.request({ method: 'eth_accounts'})

      if (accounts.length !==0) {
        setCurrentAccount(accounts[0])
        console.log('Found an authorised account: ', currentAccount)
      } else {
        console.log('No authorised account found')
      }
    }
  }

  const connectWallet = async () => {
    console.log('Connect wallet called')
    if (!getEthereum) {
      alert('Get Metamask Wallet')
      return
    }
    const ethereum = getEthereum()
    const accounts = await ethereum.request({method: 'eth_requestAccounts'})

    console.log('Connected', accounts[0])
    setCurrentAccount(accounts[0])
  }

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
