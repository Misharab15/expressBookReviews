const express = require('express');
const session = require('express-session');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const authenticated_users = require('./auth_users.js').authenticated;

const app = express();

//  Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Session Middleware (before routes)
app.use(session({
  secret: 'My name is Misharab', // same secret as JWT
  resave: false,
  saveUninitialized: true
}));

//  Routes Setup
app.use('/', public_users);
app.use('/customer', authenticated_users);

//  Start Server
app.listen(5000, () => console.log('server runnin'));

//  Route: Register New User
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username) {
    return res.status(400).json({ message: "Username is required." });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required." });
  }

  const userExist = users.find(user => user.username === username);
  if (userExist) {
    return res.status(400).json({
      message: "Username already exists. Please choose a different one."
    });
  }

  if (isValid(username)) {
    users.push({
      username: username,
      password: password
    });
  } else {
    return res.status(400).json({
      message: "Username already exists. Please choose a different one."
    });
  }

  return res.status(201).json({
    message: "User registered successfully.",
    username: username
  });
});

//  Route: Get All Books
public_users.get('/', function (req, res) {
  return res.status(200).json(JSON.stringify(books, null, 4));
});

//  Route: Get Book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (!isbn) {
    return res.status(400).json({ message: "ISBN parameter is required" });
  }

  const book = books[isbn];

  if (book) {
    return res.status(200).json({
      isbn: isbn,
      author: book.author,
      title: book.title,
      reviews: book.reviews
    });
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }
});

//  Route: Get Books by Author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  if (!author) {
    return res.status(400).json({ message: "Author parameter is required" });
  }

  const foundBooks = [];

  for (const isbn in books) {
    if (books[isbn].author === author) {
      foundBooks.push({
        isbn: isbn,
        title: books[isbn].title,
        reviews: books[isbn].reviews
      });
    }
  }

  if (foundBooks.length > 0) {
    return res.status(200).json({ author: req.params.author, books: foundBooks });
  } else {
    return res.status(404).json({ message: `No books found for author: ${req.params.author}` });
  }
});

//  Route: Get Books by Title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  if (!title) {
    return res.status(400).json({ message: "Title parameter is required" });
  }

  let foundBook;
  for (const isbn in books) {
    if (books[isbn].title === title) {
      foundBook = books[isbn];
    }
  }

  if (foundBook) {
    return res.status(200).json({
      author: foundBook.author,
      title: req.params.title,
      reviews: foundBook.reviews
    });
  } else {
    return res.status(404).json({ message: `No books found for title: ${req.params.title}` });
  }
});

//  Route: Get Book Reviews
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (!isbn) {
    return res.status(400).json({ message: "ISBN parameter is required." });
  }

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: `There is no book with ISBN ${isbn}.` });
  }

  return res.status(200).json({
    isbn: isbn,
    reviews: book.reviews
  });
});

module.exports.general = public_users;
