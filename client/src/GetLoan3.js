import React, {useState, useContext, useRef} from 'react';

export default function GetLoan3(props) {
  const {location} = props;
  const {pdf} = location.state;

  console.log(`PDF: `, pdf);
  return (
    <div>
      <a href={pdf} download="contract.pdf">Download contract pdf</a>
    </div>
  );
}
