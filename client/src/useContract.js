import {useState, useEffect} from 'react';
import {useWeb3} from './web3';
import {Contracts} from './contracts';

export function useContract(name, address) {
  const [contract, setContract] = useState();
  const web3 = useWeb3();

  useEffect(() => {
    if (web3 && name && address) {
      const c = Contracts[name];
      const contract = new web3.eth.Contract(c.abi, address);
      setContract(contract);
    }
  }, [web3, name, address]);

  return contract;
}
