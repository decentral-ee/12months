import React,{useState, useContext, useRef} from 'react';
import {Router, Switch, Route, Link} from 'react-router-dom';
import createBrowserHistory from "history/createBrowserHistory";
import {HistoryContext, ApiContext, Web3Context} from './context';
import {useWeb3} from './useWeb3';
import Landing from './Landing';
import GetLoan from './GetLoan';
import ListDeals from './listDeals';
import Listing from './listing';
import Blockies from 'react-blockies';
// include all the css-es
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

const history = createBrowserHistory();
const apiURI = process.env.REACT_APP_API_URI;

function App () {
  const [web3, ethereum] = useWeb3();
  const [daiBalance, setDaiBalance] = useState(0);
  const [account, setAccount] = useState();

  async function loadAccount(){
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    getDaiBalance();
  }
  web3 && loadAccount();
  async function getDaiBalance(){
    let tokenAddress = "0xc4375b7de8af5a38a93548eb8453a498222c4ff2";
    let walletAddress = account;
    let minABI = [
      {
        " constant":true,
        "inputs":[{"name":"_owner","type":"address"}],
        "name":"balanceOf",
        "outputs":[{"name":"balance","type":"uint256"}],
        "type":"function"
      },
      {
        "constant":true,
        "inputs":[],
        "name":"decimals",
        "outputs":[{"name":"","type":"uint8"}],
        "type":"function"
      }
    ];
    let contract = await web3.eth.contract(minABI).at(tokenAddress);
    contract.balanceOf(walletAddress, (error, balance) => {
      contract.decimals((error, decimals) => {
        balance = balance.div(10**decimals);
        setDaiBalance(balance);
      });
    });
  }
  const myBlockies = () => (
    account && (<Blockies
      seed={account.toLowerCase()}
      size={8}
      scale={8}
      className="identicon"
    />)
  )
  return (
    <Router history={history}>
      <>
        <div className="container-fluid header row">
          <div className="p-4 col-sm-4">
            <h1 className="text-left mt-0">
              <Link
                className="logo"
                to="/">
                12months
              </Link>
            </h1>
          </div>
          <div className="p-4 my-auto col text-right">
            <h3 className="account d-inline mt-4">{ daiBalance }</h3>
            <h3 className="account d-inline mb-4">{account && account.substr(0,6)}...{account && account.substr(38 , 42)}</h3>
            {myBlockies()}
          </div>
        </div>
        <div className="body container-fluid p-4">
          <HistoryContext.Provider value={history}>
            <ApiContext.Provider value={apiURI}>
              <Web3Context.Provider value={{web3, ethereum}}>
                <Switch>
                  <Route exact path="/" component={Landing} />
                  <Route path="/loan" component={GetLoan} />
                  <Route path="/listdeals" component={ListDeals} />
                  <Route path="/deal" component={Listing} />
                </Switch>
              </Web3Context.Provider>
            </ApiContext.Provider>
          </HistoryContext.Provider>
        </div>
        <footer className="container-fluid text-center py-4">
          <div>ETHParis - <a href="http://decentral.ee" target="_blank" rel="noopener noreferrer">decentral.ee</a> - 12months </div>
        </footer>
      </>
    </Router>
  );
}
export default App;
