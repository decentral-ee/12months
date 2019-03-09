import React from 'react';
import {Link} from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing">
<<<<<<< HEAD
      <div className="blocks row flex align-content-center">
        <Link className="btn btn-dark btn-lg btn-block m-4 py-auto highlight" to="/loan">Get a loan</Link>
        <Link className="btn btn-dark btn-lg btn-block m-4 py-auto highlight" to="/interest">Get Interest</Link>
=======
      <div className="blocks row">
        <div className="block col-md-6">
          <Link className="btn btn-dark btn-lg btn-block" to="/loan/1">Get a loan</Link>
        </div>
        <div className="block col-md-6">
          <Link className="btn btn-dark btn-lg btn-block" to="/interest">Get Interest loan</Link>
        </div>
>>>>>>> 25fa88d2548e4eed953b8efcbf5496a6170aedf5
      </div>
    </div>
  );
}
