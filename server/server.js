const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
