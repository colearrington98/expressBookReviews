const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username, password} = req.body;
  if(username in users){
    res.status(400).send("Username already exists");
  }
  else{
    users[username] = password;
    res.status(200).send("User registered successfully");
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbnParam = req.params.isbn;

  // Find the book with the specified ISBN in your 'books' data
  const foundBook = books.find(book => book.isbn === isbnParam);

  if (foundBook) {
    // If the book is found, send its details in the response
    res.json(foundBook);
  } else {
    // If the book is not found, send a 404 Not Found status
    res.status(404).json({ message: 'Book not found' });
  }
});


  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const requestedAuthor = req.params.author;
  const bookKeys = Object.keys(books);
  const booksByAuthor = [];
  bookKeys.forEach(key => {
    const book = books[key];
    if (book.author === requestedAuthor) {
      booksByAuthor.push(book);
    }
  });

  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor);
  } else {
    res.status(404).json({ message: 'Books by the author not found' });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const requestedTitle = req.params.title;
  const bookKeys = Object.keys(books);
  const booksByTitle = [];
  bookKeys.forEach(key => {
    const book = books[key];
    if (book.title === requestedTitle) {
      booksByTitle.push(book);
    }
  });

  if (booksByTitle.length > 0) {
    res.json(booksByTitle);
  } else {
    res.status(404).json({ message: 'Books by the title not found' });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbnParam = req.params.isbn;
  const book = books[isbnParam];

  if (book) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

module.exports.general = public_users;
