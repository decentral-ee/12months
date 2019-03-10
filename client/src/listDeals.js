import React, {useContext} from 'react';
import {HistoryContext} from './context';
import {ApiContext, Web3Context} from './context';
import {useLoadDeals} from './useLoadDeals';

export default function ListDeals() {
  const history = useContext(HistoryContext);
  const apiURI = useContext(ApiContext);
  const {deals} = useLoadDeals(apiURI);

  function finance(deal){
    const path = "/deal/" + deal.id;
    history.push({
      pathname: path,
      state: {
        ...deal
      }
    });
  }

  return (
    <>
      <div className="body">
        <div className="card-title">List Deals:</div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Car Name</th>
              <th>Year</th>
              <th>VIN#</th>
              <th>Loan</th>
              <th>Interest</th>
              <th>Term</th>
            </tr>
          </thead>
          <tbody>
            {!deals && (
              <tr><td>Loading ...</td></tr>
            )}
            {deals && deals.map(v => {
              if (!v.model) { return null; }
              return (
                <tr className=''>
                  <th scope="row">{v.model}</th>
                  <td>{v.year}</td>
                  <td>{v.vin}</td>
                  <td>{v.ask}</td>
                  <td>{v.interest}</td>
                  <td>{v.term}</td>
                  <td>
                    <button id={v.dealId} className='finance' onClick={(e)=>finance(v)}>
                      Finance!
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div>Check the vehicle's history by searching for the VIN in the <a href="https://eteenindus.mnt.ee/public/soidukTaustakontroll.jsf" target="_blank" rel="noopener noreferrer">Estonian Vehicle Registry</a> </div>
      </div>
    </>
  )
}
