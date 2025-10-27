const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middlewares/errorHandler');


const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);


app.get('/', (req, res) => res.json({ message: 'API running' }));


app.use(errorHandler);
module.exports = app;