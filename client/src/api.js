export function createDeal(apiURI, pdfHex, sigHex, params) {
  const {pdfBytes, ...rest} = params;

  return new Promise((resolve, reject) => {
    fetch(`${apiURI}/api/deals`, {
      // credentials: 'include',
      method: 'POST',
      body: JSON.stringify({
        files: [{
          content: pdfHex,
          name: 'contract.pdf.hex'
        }, {
          content: sigHex,
          name: 'contract.signature.hex'
        }],
        params: rest
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(async response => {
      const json = await response.json();
      console.log(`Sent to the server!`, json);
      resolve(json);
    }).catch(error => {
      console.log(`Error while sending files!`, error);
      reject(error);
    });
  });
}

export function updateDeal(apiURI, dealId, params) {
  return new Promise((resolve, reject) => {
    fetch(`${apiURI}/api/deals/${dealId}/buyer-signature`, {
      method: 'POST',
      body: JSON.stringify({
        ...params
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(async response => {
      const json = await response.json();
      console.log(`Deal updated!`, json);
      resolve(json);
    }).catch(error => {
      console.log(`Error while updating deal!`, error);
      reject(error);
    });
  });
}
