require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const corsOptions = require('./config/corsOptions');
const connectDb = require('./config/dbConn');

const app = express();

connectDb();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', require('./routes/userRoutes'));

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
  });
});

mongoose.connection.once('error', (error) => {
  console.log(error);
});
