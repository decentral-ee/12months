const fs = require('fs');
const path = require('path');

module.exports = {
  friendlyName: 'Get the deal',

  inputs: {
    buyerSignature: {
      type: 'string'
    }
  },

  exits: {
    success: {
      responseType: 'ok'
    }
  },

  fn: async function(inputs, exits) {
    const T='api-deals-buyer-signature';
    sails.log(`${T} requested. buyerSignature: ${inputs.buyerSignature}`);

    const dealId = this.req.param('deal_id');
    const deals = await Deal.find({id: dealId});
    if (!deals || !deals.length) {
      return this.res.json({error : 'File not Found'});
    }
    let deal = deals[0];
    console.log(`${T} deal: `, deal);

    // update
    deal = await Deal.update({
      id: deal.id
    }).set({buyerSignature: inputs.buyerSignature}).fetch()[0];
    console.log(`${T} deal: `, deal);

    exits.success({
      deal: deal
    });
  }
};
