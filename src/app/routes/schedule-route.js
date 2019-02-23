const Router = require("koa-router");
const router = new Router();
const bodyParser = require("koa-bodyparser");
const schedulePlaner = require("../../time-manager/schedule");

router.use(require("../middleware/accepts-json"));

router.use(
  bodyParser({
    enableTypes: ["json"]
  })
);

router.use((ctx, next) => {
  const now = Date.now();
  if (!Array.isArray(ctx.request.body)) {
    ctx.throw(400, "Input is not an array");
  }
  if (ctx.request.body.length < 1) {
    ctx.throw(400, "At least 1 job is required");
  }
  if (ctx.request.body.length > 100000) {
    ctx.throw(400, "Too many jobs");
  }
  try {
    if (
      !ctx.request.body.every(
        item =>
          typeof item.startingDay === "string" &&
          new Date(item.startingDay).getTime() > now &&
          typeof item.duration === "number" &&
          0 < item.duration &&
          item.duration < 1000
      )
    ) {
      ctx.throw(400, "Bad input");
    }
    ctx.schedule = schedulePlaner.prepareSchedule(ctx.request.body);
  } catch (e) {
    ctx.throw(400, e.message);
  }
  return next();
});

router.post("/", ctx => {
  ctx.body = {
    productionCycle: schedulePlaner.planSimple(ctx.schedule)
  };
});

router.post("/weighted", ctx => {
  ctx.body = {
    productionCycle: schedulePlaner.planWeighted(ctx.schedule)
  };
});

module.exports = router.routes();
