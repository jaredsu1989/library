/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
var express = require ('express');
var app = express();
var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
//Mount body parser to get info
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(urlencodedParser);

const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
//Using Mongoose to connect to database
var mongoose = require('mongoose');
mongoose.connect(MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useFindAndModify: false});
module.exports = function (app) {
//import LibrayModel
var libraryModel = require('../models/librarymodel');
  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      libraryModel.find(function(err, result) {
        if (err) {
          return res.send("Error trying to search for books in database.");
        } else {
          return res.send(result.map((currentElement) => {
            return {
              title: currentElement.title,
              _id: currentElement._id,
              commentcount: currentElement.comment.length
            }
          }));
        }
      })
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      let saveObj = new libraryModel({
        title: req.body.title
      });
      saveObj.save(function(err, product){
        if (err) {
          return res.json({error: "Cannot save booktitle"});
        } else {
          return res.json({           
            _id: product._id,
            title: product.title,
            comments: product.comment            
          });
        };
      });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      libraryModel.deleteMany(function(err) {
        if (err) {
          return res.send("error trying to delete library");
        }else {
          return res.send("complete delete successful");
        }
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;     
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    libraryModel.findById(bookid, function(err, result) {
      if (err){
        res.send("no book exists");
      } else {
        return res.json({
          title: result.title,
          _id: result._id,
          comments: result.comment
        });
      }
    });  
  })
    
    .post(function(req, res){
      var bookid = req.params.id;      
      var commentElement = req.body.comment;
      //json res format same as .get
      let updatedField = {
       $push: {comment: commentElement}
      };
    
      
      libraryModel.findByIdAndUpdate(bookid, updatedField, {new: true}, function(err, data){
        if (err || data == null) {
          return res.send("Could not update " + bookid);
        } else {
          return res.send({
            _id: data._id,
            title: data.title,
            comments: data.comment
          });
        }
      });
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    libraryModel.findByIdAndDelete(bookid, function(err) {
      if (err) {
        return res.send("error trying to delete book with id: " + bookid);
      } else {
        return res.send("delete successful");        
      }
    });
    });
  
};
