const fs = require('fs');
const path = require('path');

module.exports = {
  friendlyName: 'Get the deal',

  inputs: {

  },

  exits: {
    success: {
      responseType: 'ok'
    }
  },

  fn: async function(inputs, exits) {
    const T='api-deals-get';
    sails.log(`${T} requested`);

    const dealId = this.req.param('deal_id');
    const dealFolder = `${sails.config.appPath}/storage/${dealId}`;
    sails.log(`${T} reading deal: ${dealId} files from folder: ${dealFolder}`);
    const filenames = [];
    fs.readdirSync(dealFolder).forEach(filename => {
      const file = path.resolve(`${dealFolder}/${filename}`);
      sails.log(`${T} file: `, file);
      filenames.push(filename);
    });

    exits.success({
      filenames: filenames
    });
  }
};
