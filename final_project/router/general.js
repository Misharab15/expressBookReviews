const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios')


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
    try{
        const response = await axios.get('http://localhost:5000');
        return res.status(200).json({
            message: "Books fetched using Axios.",
            data: JSON.parse(response.data)
        })
    } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);

    return res.status(200).json({
        message: `Book with ISBN ${isbn} fetched using Axios`,
        data: response.data
    });
  } catch (error) {
        return res.status(500).json({
            message: `Error fetching book with ISBN ${isbn}`,
            error: error.message
        });
  }
  
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const author = req.params.author;

  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);

    return res.status(200).json({
        message: `Book with author: ${author} fetched using Axios`,
        data: response.data
    });
  } catch (error) {
        return res.status(500).json({
            message: `Error fetching book with author ${author}`,
            error: error.message
        });
  }
  
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const title = req.params.title;

  try {
    const response = await axios.get(`https://localhost:5000/title/${title}`);

    return res.status(200).json({
        message: `Book with title: ${title} fetched using Axios`,
        data: response.data
    });
  } catch (error) {
         return res.status(500).json({
            message: `Error fetching book with author ${author}`,
            error: error.message
        });
  }
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
