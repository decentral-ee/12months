const fs = require('fs');
const path = require('path');
const genereateContract = require('../../../utils/generate-contract');

module.exports = {
  friendlyName: 'Create new deal',

  inputs: {
    files: {
      description: 'Contract data of the deal',
      type: 'json',
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'ok'
    }
  },

  fn: async function(inputs, exits) {
    const T='api-deals-create';
    sails.log(`${T} requested`);

    const deal = await Deal.create().fetch();
    sails.log.verbose(`${T} deal ${deal.id} created`);

    const dealStorageDir = path.join(sails.config.custom.storageDirectory, deal.id.toString());
    fs.mkdirSync(dealStorageDir);

    _.forEach(inputs.files, ({content, name}) => {
      sails.log.verbose(`Received file! name: ${name}, content: `, content);
      const fileName = path.join(dealStorageDir, name);
      fs.writeFileSync(fileName, content);
    });

    exits.success({
      dealId: deal.id
    });
  }
};
