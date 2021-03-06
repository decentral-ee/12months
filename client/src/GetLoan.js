import React from 'react';
import {Route} from 'react-router-dom';
import GetLoan1 from './GetLoan1';
import GetLoan2 from './GetLoan2';
import GetLoan3 from './GetLoan3';

export default function GetLoan() {
  return (
    <div className="loan">
      <Route exact path="/loan/1" component={GetLoan1} />
      <Route exact path="/loan/2" component={GetLoan2} />
      <Route exact path="/loan/3" component={GetLoan3} />
    </div>
  );
}
