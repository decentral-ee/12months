import React from 'react';
import {Router, Switch, Route, Link} from 'react-router-dom';
import createBrowserHistory from "history/createBrowserHistory";
import {HistoryContext} from './context';
import Landing from './Landing';
import GetLoan from './GetLoan';
import GetInterest from './GetInterest';

// include all the css-es
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

const history = createBrowserHistory();

function App () {
  return (
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
          <Router history={history}>
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route path="/loan" component={GetLoan} />
              <Route path="/interest" component={GetInterest} />
            </Switch>
          </Router>
        </HistoryContext.Provider>
      </div>
      <footer className="container-fluid text-center py-4">
        <div>ETHParis - <a href="http://decentral.ee" target="_blank" rel="noopener noreferrer">decentral.ee</a> - 12months </div>
      </footer>
    </>
  );
}
export default App;
