module.exports = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link href="https://cdn.bootcss.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" rel="stylesheet">
      <script src="https://cdn.bootcss.com/jquery/3.2.0/jquery.min.js"></script>
      <script src="https://cdn.bootcss.com/bootstrap/4.0.0-beta.2/js/bootstrap.bundle.min.js"></script>
      <title>Koa Server HTMl</title>
    </head>
    <body>
      <div class="container">
        <div class="row">
          <div class="col-md-8">
            <h1>Hi <%= you %></h1>
            <p>This is <%= me %></p>
          </div>
          <div class="col-md-4">
            <p>测试动态 EJS 模板引擎</p>
          </div>
        </div>
      </div>
    </body>
  </html>
`