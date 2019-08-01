const errorController = async(ctx, next) => {
  try {
    await next()
  } catch (error) {
    console.log(500)
    ctx.status = 500
    ctx.redirect(ctx.router.url('500'))
  }
  if (parseInt(ctx.status) === 404) {
    ctx.redirect(ctx.router.url('404'))
  }
}

module.exports = errorController
