import React from 'react';
import {Link} from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing">
      <div className="body">
        <div className="subheader">Instant Crypto Loans</div>
        <div className="blocks">
          <div className="block">
            <Link className="btn btn-dark btn-lg" to="/loan">Get a loan</Link>
          </div>
          <div className="block">
            <Link className="btn btn-dark btn-lg" to="/interest">Get Interest loan</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
