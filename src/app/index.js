const Koa = require("koa");
const app = new Koa();
const Router = require("koa-router");
const router = new Router();

router.use("/schedule", require("./routes/schedule-route"));

app.use(router.routes());
app.use(router.allowedMethods());
app.use((ctx)=>ctx.throw(404));

module.exports = app;
