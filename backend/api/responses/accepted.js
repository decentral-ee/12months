module.exports = function ok(data) {
  var res = this.res;

  return res.status(202).send(Object.assign({
    success: true,
    status_code: 202,
  }, data));
};
