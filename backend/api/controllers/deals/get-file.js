const fs = require('fs');
const path = require('path');

module.exports = {
  friendlyName: 'Get the deal file',

  inputs: {
  },

  exits: {
    success: {
      responseType: 'ok'
    }
  },

  fn: async function(inputs, exits) {
    const T='api-deals-get-file';
    sails.log(`${T} requested`);

    const dealId = this.req.param('deal_id');
    const filename = this.req.param('filename');
    const dealFolder = `${sails.config.appPath}/storage/${dealId}`;
    const file = path.resolve(`${dealFolder}/${filename}`);
    sails.log(`${T} reading deal: ${dealId} files from folder: ${dealFolder}`);
    if (fs.existsSync(file)) {
      this.res.setHeader('Content-disposition', 'attachment; filename=' + filename);
      const filestream = fs.createReadStream(file);
      filestream.pipe(this.res);
    } else {
      this.res.json({error : 'File not Found'});
    }
    // exits.success({
    // });
  }
};
