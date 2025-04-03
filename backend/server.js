const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 3000;
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN || "1h";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const DBP = process.env.DB_PASSWORD;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const config = {
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const client = new OAuth2Client(GOOGLE_CLIENT_ID); // Google OAuth client
let pool = mysql.createPool(config);

//Middleware
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../dist")));

//Endpoints

// Register Endpoint
app.post("/register", async (req, res) => {
  const { username, pass } = req.body;

  if (!username || !pass) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  let connection;
  try {
    connection = await mysql.createConnection(config);

    // Check if username exists
    const [users] = await connection.execute(
      "SELECT accID FROM Accounts WHERE username = ?",
      [username]
    );

    if (users.length > 0) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(pass, 10);

    // Create new user
    const [result] = await connection.execute(
      "INSERT INTO Accounts (username, pass) VALUES (?, ?)",
      [username, hashedPassword]
    );

    res.status(201).json({
      message: "User created successfully",
      accID: result.insertId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) await connection.end();
  }
});

// Login Endpoint
app.post("/login", async (req, res) => {
  const { username, pass } = req.body;

  if (!username || !pass) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  let connection;
  try {
    connection = await mysql.createConnection(config);

    // Get user from database
    const [users] = await connection.execute(
      "SELECT accID, pass FROM Accounts WHERE username = ?",
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];

    // Compare passwords
    const validPassword = await bcrypt.compare(pass, user.pass);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { accID: user.accID, username: username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    //console.log(user.accID+" "+username)
    res.json({
      message: "Login successfully",
      username: username,
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) await connection.end();
  }
});

//Authentication verification
/*
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
*/

const verifyAuthentication = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No token provided or invalid format." });
  }
  const token = authHeader.split(" ")[1]; // Extract the token after "Bearer "
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token." });
    }
    //  console.log(decoded.accID+" "+decoded.username);
    req.accID = decoded.accID;
    req.username = decoded.username;
    next();
  });
};

// LIST PROCEDURES -----------------------------

app.post("/addList", verifyAuthentication, async (req, res) => {
  //console.log("decode "+decoded.username+" "+decoded.accID);

  // below line breaks the add logic
  // const name= req.username;

  const name = req.body.name;
  const ownerID = req.accID;
  try {
    await pool.query("CALL addList(?, ?)", [ownerID, name]);
    res.send("Success");
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/getLists", verifyAuthentication, async (req, res) => {
  const ownerID = req.accID;
  if (!ownerID) {
    return res.status(400).json({ error: "ownerID is required" }); // Handle missing ownerID
  }
  try {
    const [results] = await pool.query("CALL getLists(?)", [ownerID]);
    res.json(results[0]);
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.put("/updateList", verifyAuthentication, async (req, res) => {
  const newName = req.body.newName;
  const listID = req.body.listID;
  const accountID = req.accID;

  try {
    await pool.query("CALL updateList(?, ?, ?)", [listID, accountID, newName]);
    res.send("Success");
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/deleteList/:listID", verifyAuthentication, async (req, res) => {
  // below line breaks the delete logic
  // const listID = req.params;

  const listID = req.params.listID;
  const ownerID = req.accID;

  try {
    const [result] = await pool.query("CALL deleteList(?, ?)", [
      listID,
      ownerID,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "List not found or unauthorized" });
    }

    res.send("Success");
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// TASK PROCEDURES -----------------------------

app.get("/getTasks", async (req, res) => {
  const listID = req.query.listID;
  if (!listID) {
    return res.status(400).json({ error: "listID is required" });
  }
  try {
    const [results] = await pool.query("CALL getTasks(?)", [listID]);
    res.json(results[0]);
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/addTask", async (req, res) => {
  const listID = req.body.listID;
  const taskDescription = req.body.taskDescription;
  const taskTime = req.body.taskTime;
  try {
    await pool.query("CALL addTask(?, ?, ?)", [
      listID,
      taskDescription,
      taskTime,
    ]);
    res.send("Success");
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/markTask", async (req, res) => {
  const itemID = req.body.itemID;
  const taskMark = req.body.taskMark;
  try {
    await pool.query("CALL markTask(?, ?)", [itemID, taskMark]);
    res.send("Success");
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.put("/updateTask", async (req, res) => {
  const itemID = req.body.itemID;
  const newDescription = req.body.newDescription;
  const newTime = req.body.newTime;
  try {
    await pool.query("CALL updateTask(?, ?, ?)", [
      itemID,
      newDescription,
      newTime,
    ]);
    res.send("Success");
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ error: "Database error" });
  }

  pool.query(
    "CALL updateTask(?, ?, ?)",
    [itemID, newDescription, newTime],
    (err, result) => {
      if (err) {
        console.error("Error executing query", err);
      } else {
        res.send("Success!");
      }
    }
  );
});

app.delete("/deleteTask/:itemID", async (req, res) => {
  const { itemID } = req.params;

  try {
    const [result] = await pool.query("CALL deleteTask(?)", [itemID]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "List not found or unauthorized" });
    }

    res.send("Success");
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// OAuth 2.0 Google Login Endpoint
app.post("/google-login", async (req, res) => {
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
        "SELECT accID FROM Accounts WHERE username = ?",
        [googleUsername]
      );

      let accID;
      if (users.length === 0) {
        // Create new user (no password needed for Google login)
        const [result] = await connection.execute(
          "INSERT INTO Accounts (username) VALUES (?)",
          [googleUsername]
        );
        accID = result.insertId;
      } else {
        accID = users[0].accID;
      }

      const token = jwt.sign(
        { accID: accID, username: googleUsername },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      //console.log(user.accID+" "+username)
      res.json({
        message: "Google login successful",
        username: googleUsername,
        token: token,
      });


    } catch (error) {
      console.error("Google login error:", error);
      res.status(500).json({ error: "Internal server error" });
    } finally {
      if (connection) await connection.end();
    }
  } catch (error) {
    console.error("Google token verification error:", error);
    res.status(401).json({ error: "Invalid Google token" });
  }
});

// Existing routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
