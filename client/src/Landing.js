import React from 'react';
import {Link} from 'react-router-dom';

export default function Landing() {
  return (
    <div className="landing">
      <h2 className="text-center pt-2">Stake your car,</h2>
      <h2 className="text-center pb-2">get an instant loan</h2>
      <div className="blocks row flex justify-content-center">
        <div className="d-flex align-items-stretch m-2 justify-content-center">
          <Link
            className="btn btn-lg m-2 p-2 highlight d-flex align-self-center text-center"
            to="/loan/1">
            12month<br />LOAN
          </Link>
        </div>
        <div className="d-flex align-items-stretch m-2 justify-content-center">
          <Link
            className="btn btn-lg m-2 p-2 highlight d-flex align-self-center text-center"
            to="/listdeals">
            12month<br />INTEREST
          </Link>
        </div>
      </div>
    </div>
  );
}
