import React from 'react';
import {Link} from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing">
      <div className="blocks row">
        <div className="block col-md-6">
          <Link className="btn btn-dark btn-lg btn-block" to="/loan">Get a loan</Link>
        </div>
        <div className="block col-md-6">
          <Link className="btn btn-dark btn-lg btn-block" to="/interest">Get Interest loan</Link>
        </div>
      </div>
    </div>
  );
}
