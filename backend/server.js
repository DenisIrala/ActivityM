const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const jwt =require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const DBP = process.env.DB_PASSWORD;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;


const config = {
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const client = new OAuth2Client(GOOGLE_CLIENT_ID); // Google OAuth client
let pool=mysql.createPool(config);;

//Middleware
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

//Endpoints


// Register Endpoint
app.post('/register', async (req, res) => {
  const { username, pass } = req.body;
  
  if (!username || !pass) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  let connection;
  try {
    connection = await mysql.createConnection(config);
    
    // Check if username exists
    const [users] = await connection.execute(
      'SELECT accID FROM Accounts WHERE username = ?',
      [username]
    );
    
    if (users.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(pass, 10);

    // Create new user
    const [result] = await connection.execute(
      'INSERT INTO Accounts (username, pass) VALUES (?, ?)',
      [username, hashedPassword]
    );

    res.status(201).json({
      message: 'User created successfully',
      accID: result.insertId
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) await connection.end();
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  const { username, pass } = req.body;

  if (!username || !pass) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  let connection;
  try {
    connection = await mysql.createConnection(config);
    
    // Get user from database
    const [users] = await connection.execute(
      'SELECT accID, pass FROM Accounts WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    
    // Compare passwords
    const validPassword = await bcrypt.compare(pass, user.pass);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { accID: user.accID, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      accID: user.accID,
      username: user.username
    });



  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) await connection.end();
  }
});

//Authentication verification

app.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      accID: decoded.accID,
      username: decoded.username
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.post("/addList",(req,res)=>{
  const name= req.body.name;
  const description=req.body.description;
  const author=req.body.author;
  const noe=req.body.noe;
  const demography=req.body.demography;
  const link=req.body.link;

  client.query('INSERT INTO "Manga"(nombre_manga,descripcion,link, autor, nchap, demografia) VALUES($1,$2,$3,$4,$5,$6);',[name,description,link,author,noe,demography], (err, result) => {
    if (err) {
      console.error('Error executing query', err);
    } else {
      console.log('Query result:', result.rows);
      res.send("Exito!");
    }
  });

});

app.get("/getLists",(req,res)=>{
  const ownerID=req.body.ownerID;
  if (!ownerID) {
    return res.status(400).json({ error: 'ownerID is required' }); // Handle missing ownerID
  }
  pool.query('CALL getLists(?)', [ownerID], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error' });
    } else {
      console.error('Got results', err);
      res.json(results);
      res.send("Success!");
    };
  })
})

app.put("/updateList",(req,res)=>{
  const newName= req.body.newName;
  const accountId= req.body.accountId;
  const listId= req.body.listId;
  pool.query('CALL updateList(?, ?, ?)',[newName,accountId,listId], (err, result) => {
    if (err) {
      console.error('Error executing query', err);
    } else {
      res.send("Success!");
    }
  });
})

app.delete("/deleteList/:lidtID",(req,res)=>{
  const {listID}= req.params;
  const ownerID = req.body.ownerID;

  client.query('CALL deleteList(?,?)',[listID,ownerID], (err, result) => {
    if (err) {
      console.error('Error executing query', err);
    } else {
      res.send("Success!");
    }
  });
})

// OAuth 2.0 Google Login Endpoint
app.post('/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleUsername = payload.email; // Use email as username

    let connection;
    try {
      connection = await mysql.createConnection(config);

      // Check if user exists
      const [users] = await connection.execute(
        'SELECT accID FROM Accounts WHERE username = ?',
        [googleUsername]
      );

      let accID;
      if (users.length === 0) {
        // Create new user (no password needed for Google login)
        const [result] = await connection.execute(
          'INSERT INTO Accounts (username) VALUES (?)',
          [googleUsername]
        );
        accID = result.insertId;
      } else {
        accID = users[0].accID;
      }

      res.json({ message: 'Google login successful', accID: accID });
    } catch (error) {
      console.error('Google login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      if (connection) await connection.end();
    }
  } catch (error) {
    console.error('Google token verification error:', error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

// Existing routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});