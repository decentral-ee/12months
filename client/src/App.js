import React from 'react';
import {Router, Switch, Route, Link} from 'react-router-dom';
import createBrowserHistory from "history/createBrowserHistory";
import {HistoryContext, ApiContext, Web3Context} from './context';
import {useWeb3} from './useWeb3';
import Landing from './Landing';
import GetLoan from './GetLoan';
import GetInterest from './GetInterest';

// include all the css-es
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

const history = createBrowserHistory();
const apiURI = process.env.REACT_APP_API_URI;

function App () {
  const web3 = useWeb3();

  return (
    <Router history={history}>
      <>
        <div className="container-fluid header">
          <div className="p-4 w-100 row">
            <h1 className="logo text-left mt-0">
              <Link
                to="/">
                12months
              </Link>
            </h1>
          </div>
        </div>
        <div className="body container-fluid p-4">
          <HistoryContext.Provider value={history}>
            <ApiContext.Provider value={apiURI}>
              <Web3Context.Provider value={web3}>
                <Switch>
                  <Route exact path="/" component={Landing} />
                  <Route path="/loan" component={GetLoan} />
                  <Route path="/interest" component={GetInterest} />
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
