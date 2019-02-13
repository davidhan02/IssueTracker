/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect            = require('chai').expect,
      MongoClient       = require('mongodb'),
      ObjectId          = require('mongodb').ObjectID,
      mongoose          = require('mongoose'),
      CONNECTION_STRING = process.env.DB; 
      //MongoClient.connect(CONNECTION_STRING, (err, db) => {});

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project,
          query   = req.query;
      //modify query values if they are passed
      if (query._id) {
        //set query id to an object of query id
        query._id = new ObjectId(query._id);
      }
      if (query.open) {
        //set query.open to reflect proper bool
        query.open = String(query.open) == 'true';
      }
      //connect to the database for searching with query
      MongoClient.connect(CONNECTION_STRING, (err, db) => {
        if (err) {res.send(err);}
        let data = db.collection(project);
        //search collection for query, makes result into an array
        data.find(query).toArray((err, array) => {
          if (err) {res.send(err);}
          res.json(array);
        });
      });
    })
    
    .post(function (req, res){
      let project = req.params.project;
      //formatting template for input
      //values passed from index page form here
      let issue = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || '',
        open: true,
        status_text: req.body.status_text || ''
      };
      if (!issue.issue_title || !issue.issue_text || !issue.created_by) {
        res.send('No updated field sent');
      } else {
        MongoClient.connect(CONNECTION_STRING, (err, db) => {
          if (err) {res.send(err);}
          let data = db.collection(project);
          //insertOne is same as save and update
          data.insertOne(issue, (err, result) => {
            if (err) {res.send(err);}
            //assign id of issues
            issue._id = result.insertedId;
            //return json of input
            res.json(issue);
          });
        });
      }
    })
    
    .put(function (req, res){
      let project = req.params.project,
          inputs = req.body,
          id = new ObjectId(req.body._id);
      //delete _id from inputs
      delete req.body._id
      //delete any extraneous inputs
      for (let i in inputs) {
        if (!inputs[i]) {
          delete inputs[i];
        }
      }
      if (inputs.open) {
        //test for bool value in same way as before
        inputs.open = String(inputs.open) == 'true';
      }
      //if input.issue_title or ._id or anything isn't sent
      if (Object.keys(inputs).length == 0) {
        res.send('No updated field sent');
      } else {
        //send another key with updates
        inputs.updated_on = new Date();
        //connect to DB here
        MongoClient.connect(CONNECTION_STRING, (err, db) => {
          if (err) {res.send(err);}
          let data = db.collection(project);
          //find and modify
          data.findAndModify(
            {_id: id}, 
            [['_id', 1]], 
            {$set: inputs},
            {new: true},
            (err, result) => {
              if (err) {res.send(err);}
              res.send('Successfully updated!');
            }
          );
        });
      }
    })
    
    .delete(function (req, res){
      let project = req.params.project,
          id = new ObjectId(req.body._id);
      if (!req.body._id) {
        res.send('ID Error')
      } else {
        MongoClient.connect(CONNECTION_STRING, (err, db) => {
          if (err) {res.send(err);}
          let data = db.collection(project);
          //find by id and delete
          data.findAndRemove({_id: id}, (err, result) => {
            if (err) {res.send(err);}
            else {res.send('Successfully deleted ' + id);}
          });
        });
      }
    });
    
};
