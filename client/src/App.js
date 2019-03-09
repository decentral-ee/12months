import React from 'react';
import {Router, Switch, Route, Link} from 'react-router-dom';
import createBrowserHistory from "history/createBrowserHistory";
import {HistoryContext, ApiContext} from './context';
import Landing from './Landing';
import GetLoan from './GetLoan';
import ListDeals from './listDeals';
import Listing from './listing';
// include all the css-es
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

const history = createBrowserHistory();
const apiURI = process.env.REACT_APP_API_URI;

function App () {
  return (
    <Router history={history}>
      <>
        <div className="container-fluid header">
          <div className="p-4 w-100 row">
            <h1 className="text-left mt-0">
              <Link
                className="logo"
                to="/">
                12months
              </Link>
            </h1>
          </div>
        </div>
        <div className="body container-fluid p-4">
          <HistoryContext.Provider value={history}>
            <ApiContext.Provider value={apiURI}>
              <Switch>
                <Route exact path="/" component={Landing} />
                <Route path="/loan" component={GetLoan} />
                <Route path="/listdeals" component={ListDeals} />
                <Route path="/deal" component={Listing} />
              </Switch>
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
