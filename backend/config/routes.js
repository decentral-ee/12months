/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  'POST /api/deals': { action: 'deals/create' },
  'POST /api/deals/:deal_id/buyer-signature': { action: 'deals/update-buyer-signature' }
};
