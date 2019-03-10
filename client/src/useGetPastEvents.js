import {useState, useEffect} from 'react';
import {useWeb3} from './useWeb3';
import {useContract} from './use-contract';

export function useGetPastEvents(contractName, contractAddress, eventName) {
  const [events, setEvents] = useState();
  const web3 = useWeb3();
  const contract = useContract(contractName, contractAddress);

  useEffect(() => {
    if (web3 && contract) {
      (async () => {
        const events = await contract.getPastEvents(eventName, {
          fromBlock: 0,
          toBlock: 'latest'
        });
        setEvents(events);
      })();
    }
  }, [web3, contract]);

  return events;
}
