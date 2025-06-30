const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session')

let users = [];

const JWT_SECRET = 'My name is Misharab'

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return username && typeof username === 'string' && username.trim().length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const user = users.find(user => user.username === username);
    return user && user.password === password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
    return res.status(400).json({
        message: "Username and password are required."
    })
  }

  // validating username format
  if(!isValid(username)) {
    return res.status(40).json({
        message: "Invalid username format."
    });
  }
   
  // check if username and password are correct
  if(!authenticatedUser(username, password)) {
    return res.status(401).json({
        message: "Invalid username or password."
    });
  }


  // Saving token in a session
  req.session.authorization = {
    accessToken: token,
    username: username
  };

  return res.status(200).json({
    message: "Login successful",
    token: token,
    username: username
    });
});


// middleware to verify if the user is logged in or not
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({ message: "Access token missing"})
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if(err)
            res.status(403).json({ message: "Invalid token" })

        req.user = user;
        next();
    })
}

// Add a book review
regd_users.put("/auth/review/:isbn", authenticateToken, (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const reviewText = req.query.review;
  const username = req.user.username;

  if(!isbn || !reviewText) {
    return res.status(400).json({
        message: "ISBN and review are required"
    })
  }

  const book = books[isbn];

  if(!book) {
    return res.status(404).json({
        message: `Book with ISBN ${isbn} not found.`
    });
  }

  // Add or update review by username
  book.reviews[username] = reviewText;

  return res.status(200).json({
    message: "Review successfully added/updated.",
    reviews: book.reviews
    });
});


// Delete a book review
regd_users.delete('/auth/review/:isbn', authenticateToken, (req, res) => {
    const username = req.user.username;
    const isbn = req.params.isbn;

    const book = books[isbn];

    // Check if ISBN exists
    if(!book) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.`})
    }

    // Check if the user already had a review to delete
    if(!book.reviews[username]) {
        return res.status(404).json({ message: `No review found for user ${username} on this book.` })
    }

    // Delete the user's review
    delete book.reviews[username];

    return res.status(200).json({
        message: `Review by ${username} deleted successfully.`,
        reviews: book.reviews
    })
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
