export function sendFiles(apiURI, pdfHex, sigHex) {
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
        }]
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
