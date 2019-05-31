const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const productsAPI = require('./api/routes/products')
const ordersAPI = require('./api/routes/orders')
const userAPI = require('./api/routes/user')

const app = express()

mongoose.set('useCreateIndex', true)
// mongoose.connect('mongodb+srv://skyrie:1n1p455w0rd@cluster0-jkrgs.mongodb.net/test?retryWrites=true', { useNewUrlParser: true })
mongoose.connect('mongodb://127.0.0.1:27017/kasir', { useNewUrlParser: true })


app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use('/uploads', express.static('uploads'))

app.use('/products', productsAPI)
app.use('/orders', ordersAPI)
app.use('/user', userAPI)

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404
  next(error)
})

module.exports = app