const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;
const DBP = process.env.DB_PASSWORD;

const mysql = require('mysql2/promise');


const config = {
  host: 'localhost',
  user: 'typh',
  password: process.env.DB_PASSWORD,
  database: 'ActivityM'
};

async function main() { //Testing database
  let connection;
  try {
    // Create a connection
    connection = await mysql.createConnection(config);
    
    console.log('Successfully connected to the database');

  } catch (error) {
    console.error('Database error:', error);
  } finally {
    // Close the connection
    if (connection) await connection.end();
  }
}

main();

//Endpoints

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