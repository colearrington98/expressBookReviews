// Import necessary modules
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// Users and helper functions
let users = [
  { username: "user1", password: "pass1" },
  { username: "user2", password: "pass2" }
];

const isValid = (username) => {
  return username.trim() !== '';
}

const authenticatedUser = (username, password) => {
  username = username.trim();
  password = password.trim();

  const user = users.find(u => u.username === username && u.password === password);
  return !!user;
}

// Authentication middleware
const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'your-default-secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

regd_users.use(authenticateUser);

// Login route
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("Received username:", username);
  console.log("Received password:", password);

  if (authenticatedUser(username, password)) {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'your-default-secret';
    const accessToken = jwt.sign({ username: username }, accessTokenSecret);
    res.json({ accessToken: accessToken });
  } else {
    res.status(400).send("Username or password incorrect");
  }
});

// Add or modify a book review route
regd_users.post("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  // Check if the ISBN exists in the books object
  if (isbn && books[isbn]) {
    // Create the 'reviews' object if it doesn't exist
    books[isbn].reviews = books[isbn].reviews || {};

    // Add or modify the review
    books[isbn].reviews[req.user.username] = review;
    res.status(200).send("Review added/modified successfully");
  } else {
    res.status(404).send("Book not found");
  }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;


