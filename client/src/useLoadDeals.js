import {useEffect, useState} from 'react';

export function useLoadDeals(apiURI) {
  const [deals, setDeals] = useState();

  async function loadDeals() {
    const res = await fetch(`${apiURI}/api/deals`, {
    }).then(response => response.json());
    setDeals(res.deals);
  }

  useEffect(() => {
    loadDeals();
  }, [apiURI]);

  return {
    deals
  }
}
