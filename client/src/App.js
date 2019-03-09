import React from 'react';
import {Router, Switch, Route} from 'react-router-dom';
import createBrowserHistory from "history/createBrowserHistory";
import Landing from './Landing';
import GetLoan from './GetLoan';

// include all the css-es
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

const history = createBrowserHistory();

function App () {
  return (
    <>
      <div className="container-fluid header">
        <div className="p-2 w-100 row">
          <h1 className="logo text-left mt-0">12months</h1>
        </div>
      </div>
      <div className="body container">
        <h1 className="text-center my-3">Instant Crypto Loans</h1>
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/loan" component={GetLoan} />
          </Switch>
        </Router>
      </div>
      <div className="footer">
        <div className="text-center">ETHParis - 12months team - <a href="http://decentral.ee" target="_blank" rel="noopener noreferrer">decentral.ee</a></div>
      </div>
    </>
  );
}
export default App;
