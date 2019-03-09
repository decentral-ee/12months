import React from 'react';
import {Router, Switch, Route} from 'react-router-dom';
import createBrowserHistory from "history/createBrowserHistory";
import {HistoryContext} from './context';
import Landing from './Landing';
import GetLoan from './GetLoan';

// include all the css-es
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

const history = createBrowserHistory();

function App () {
  return (
    <>
      <div className="container header">
        <div className="p-2 w-100 row">
          <h1 className="logo text-left mt-0">12months</h1>
        </div>
      </div>
      <div className="body container">
        <h3 className="text-center d-inline">Instant Crypto Loans</h3>
        <HistoryContext.Provider value={history}>
          <Router history={history}>
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route path="/loan" component={GetLoan} />
            </Switch>
          </Router>
        </HistoryContext.Provider>
      </div>
    </>
  );
}
export default App;
