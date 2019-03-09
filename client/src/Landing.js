import React from 'react';
import {Link} from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing">
      <div className="blocks row flex align-content-center">
        <Link className="btn btn-dark btn-lg btn-block m-4 py-auto highlight" to="/loan">Get a loan</Link>
        <Link className="btn btn-dark btn-lg btn-block m-4 py-auto highlight" to="/interest">Get Interest</Link>
      </div>
    </div>
  );
}
