const responseTime = async (ctx, next) => {
  const start = Date.now()
  await next()
  const end = Date.now()
  console.log(ctx.method + ' ' + ctx.url + ' ' + (end - start) + 'ms')
}

module.exports = responseTime
