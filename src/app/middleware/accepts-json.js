module.exports = function(ctx, next) {
  if (!ctx.is("json")) {
    ctx.throw(406, "only json accepted");
  }
  return next();
};
