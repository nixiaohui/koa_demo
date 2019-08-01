## Koa2的传参

### 参数传递及接收的几种方式

* 传统方式（在url请求地址上，使用`?` 、` &`、`=`进行传参 ）
* 通过router路径进行传参（/:id）
* 通过post传参（koa-parserbody）

#### 传统方式

> 通过url请求地址进行传参，如：`http://127.0.0.1/user?name=hugo&age=20`

这种方式在接收参数时，可以通过两种方式进行参数获取

1. 通过 `ctx.request.query` 或 `ctx.query` 获取参数对象（后者可以看成是前者的缩写，在koa中，ctx包含了request及response）。

   ```js
   // url ===> http://127.0.0.1/user?name=hugo&age=20
   router.get('/user', async (ctx, next) => {
   	let {name, age} = ctx.query	// ===> let {name, age} = ctx.request.query
     console.log(name)	// 输出：hugo
     console.log(age)	// 输出：20
     ctx.body = {
       name: name,
       age: age
     }
   })
   ```

2. 通过`ctx.request.querystring`或`ctx.querystring`获取参数字符串。

   ```js
   // url ===> http://127.0.0.1/user?name=hugo&age=20
   router.get('/user', async (ctx, next) => {
   	let req = ctx.querystring
     console.log(req)	// 输出：name=hugo&age=20
     ctx.body = {
       req: req
     }
   })
   ```

#### 通过router路径进行传参

通过router路径传参，如：`router.get('/:name/:age', handler)`

这种方式在接收参数时，可以通过`ctx.params` 进行参数接收，如：

```js
// url ===> http://127.0.0.1/user/hugo/20
router.get('/user/:name/:age', async (ctx, next) => {
  let { name, age } = ctx.params
  console.log(name)	//	输出： hugo
  console.log(age)	//	输出：	20
  ctx.body = {
    name: name,
    age: age
  }
})

```

#### 通过POST传参

通过表单提交post数据进行传参时，可以借助`koa-bodyparser`中间件进行便捷接收数据处理，如：

```js
const bodyParser = require('koa-bodyparser')
const app = new Koa()
app.use(bodyParser())
```

使用了`koa-bodyparser`需要接收的post表单参数都存放在了`ctx.request.body`中，示例：

```js
router.get('/user', async (ctx, next) => {
  ctx.body = `
		<form action="/user/login" method="post">
			<input name="name" type="text" placeholder="输入用户名" />
			<input name="password" type="password" palaceholder="请输入密码" />
			<button type="submit">提交</button> 
		</form>
	`
})

router.post('/user/login', async (ctx, next) => {
  let { name, password } = ctx.request.body
  ctx.body = {
    name: name,
    password: password
  }
})
```



