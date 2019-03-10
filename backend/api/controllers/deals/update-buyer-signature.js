const fs = require('fs');
const path = require('path');

module.exports = {
  friendlyName: 'Get the deal',

  inputs: {
    zxOrder: {
      type: 'json'
    },
    zxOrderSignature: {
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
    sails.log(`${T} requested. inputs: ${inputs}`);

    const dealId = this.req.param('deal_id');
    let deals = await Deal.find({id: dealId});
    if (!deals || !deals.length) {
      return this.res.json({error : 'File not Found'});
    }
    let deal = deals[0];
    console.log(`${T} deal: `, deal);

    // update
    deals = await Deal.update({
      id: deal.id
    }).set({
      zxOrder: inputs.zxOrder,
      zxOrderSignature: inputs.zxOrderSignature,
    }).fetch();
    deal = deals[0];
    console.log(`${T} deal: `, deal);

    exits.success({
      deal: deal
    });
  }
};
