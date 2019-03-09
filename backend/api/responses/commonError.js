module.exports = (status_code, reason) => function serverError(err) {
  var res = this.res;

  if (status_code === 500) {
    sails.log.error("server internal error", err);
  }

  return res.status(status_code).send(_.extend({
    success: false,
    reason,
    status_code
  }, typeof(err) === "object" ? {
    error_name: err.name,
    error_message: err.message,
    error_code: err.code,
    problems: err.problems,
    stack: err.stack
  } : { error_message: err }));
};
