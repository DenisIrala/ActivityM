const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;
const mysql = require('mysql2/promise');


const config = {
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

app.use(express.static(path.join(__dirname, '../dist')))
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('*', (req, res) => { // Serve index.html for all other routes
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});