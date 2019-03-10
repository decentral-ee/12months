module.exports = {
  friendlyName: 'Get the deals',

  inputs: {

  },

  exits: {
    success: {
      responseType: 'ok'
    }
  },

  fn: async function(inputs, exits) {
    const T='api-deals-list';
    sails.log(`${T} requested`);

    const deals = await Deal.find().sort('id DESC');
    console.log(`Deals: `, deals.length);

    exits.success({
      deals: deals
    });
  }
};
