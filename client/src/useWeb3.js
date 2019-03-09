/* global ethereum */
import {useState, useEffect} from 'react';
import Web3 from 'web3';

export function useWeb3() {
  const [web3, setWeb3] = useState();

  async function initWeb3() {
    if (window.ethereum) {
      try {
        await ethereum.enable();
        setWeb3(new Web3(ethereum));
      } catch (error) {
        console.error("Failed to create web3!", error);
      }
    } else if (window.web3) {
      setWeb3(new Web3(web3.currentProvider));
    }
  }

  useEffect(() => {
    initWeb3();
  });

  return web3;
}
