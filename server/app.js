const express = require('express');
const app = express();
const cookiesParser = require('cookie-parser')
const errorMiddleware = require('./middlewares/errors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookiesParser());
app.use(fileUpload());

//import all router
const products = require('./routes/product');
const auth = require('./routes/auth');
const order = require('./routes/order');


app.use('/api/v1', products)
app.use('/api/v1', auth)
app.use('/api/v1',order)

//middleware to handle errors
app.use(errorMiddleware);

module.exports = app
