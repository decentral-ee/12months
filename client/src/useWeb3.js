/* global ethereum */
import {useState, useEffect} from 'react';
import Web3 from 'web3';

export function useWeb3() {
  const [web3, setWeb3] = useState();
  const [ethereum, setEthereum] = useState();

  async function initWeb3() {
    if (window.ethereum) {
      setWeb3(new Web3(window.ethereum));
      setEthereum(window.ethereum);
    } else if (window.web3) {
      setWeb3(new Web3(window.web3.currentProvider));
    }
  }

  useEffect(() => {
    initWeb3();
  }, []);

  return [web3, ethereum];
}
