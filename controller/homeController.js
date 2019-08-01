const index = async(ctx, next) => {
  await ctx.render('home', {
    time: Date()
  })
}

const error = async(ctx, next) => {
  ctx.throw(500)
}

const getParams = async (ctx, next) => {
  let {name, age} = ctx.params 
  ctx.body = {
    name,
    age
  }
}

const getBody = async (ctx, next) => {
  let {name, age} = ctx.request.body 
  ctx.body = {
    name,
    age
  }
}

module.exports = {
  index,
  error,
  getParams,
  getBody
}
