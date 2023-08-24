require('dotenv').config();

const express = require('express');

const connectDB = require('./src/db/db');

const payment = require('./src/routers/payment');
const cart = require('./src/routers/cart');
const productRoutes = require('./src/routers/products');
const address = require('./src/routers/address');
const stripe = require('stripe')(process.env.TEST_KEY); //test key needed to access stripe
connectDB();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api1', payment);
app.use('/api2', cart);
app.use('/api3', productRoutes);
app.use('/api4', address);

const PORT = process.env.PORT || 1945;
app.listen(PORT, () => {
	console.log(`server started on port ${PORT}`);
});
