import React from 'react';

export default function Deal(props) {
  const {location} = props;
  const {fillOrderTxHash} = location.state;

  return (
    <>
      <div className="body">
        <div className="card-title">Car Investment:</div>
        <div className="form card mx-auto">
          <div className="photo card-img-top mb-3">
          </div>
          <div className="p-4 getLoan3">
            <div className=" row no-gutters">
              <label htmlFor="vin" className="col-sm-4 col-form-label">TX hash</label>
              <div className="col-sm-8 px-2">{fillOrderTxHash}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
