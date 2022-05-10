import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, {useEffect, useState} from "react";
import { ethers } from 'ethers';
import myEpicNft from './utils/EpicNfts.json'

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {

  const [currentAccount, setCurrentAccount] = useState()

  //function to get ethereum object
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

  //function to check if wallet is connected and if there is an authorised account
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


  //function to connect wallet to website
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

  //function to ask contract to mint NFT
  const askContractToMintNft = async () => {
    console.log('mint function called')
    const CONTRACT_ADDRESS = '0xED67b710B58912D1BbF696e43AD65D828bEB4Fc5'

    const ethereum = getEthereum()

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      console.log(signer)

      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer)

      console.log('Going to pop wallet to pay gas')
      let nftTxn = await connectedContract.makeAnEpicNFT()

      console.log('Mining...Please wait.')
      await nftTxn.wait()

      console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`)
    }
    else {
      console.log('Ethtereum object does not exist')
    }
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
          <p className="header gradient-text">BallersCars&Food NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === ''?  renderNotConnectedContainer(): (
            <button onClick={askContractToMintNft} className='cta-button connect-wallet-button'>Mint NFT</button>
          )}
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
