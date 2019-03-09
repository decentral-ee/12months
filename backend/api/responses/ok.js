module.exports = function ok(data) {
  var res = this.res;
  return res.status(200).send(Object.assign({
    success: true,
    status_code: 200,
  }, data));
};
