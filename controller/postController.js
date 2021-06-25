const PostModels = require("../model/postModels")
const express = require("express");

exports.createPost = function (req, res) {
  let newPost = new PostModels({
    image: req.file.path,
    // name: req.body.name,
    description: req.body.description,
    // hp: req.body.hp,
    // mp: req.body.mp,
    // atk: req.body.atk,
    // def: req.body.def,
    // spd: req.body.spd,
    // acc: req.body.acc,
  })
  newPost.save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          text: result.text,
          label: result.label,
          _id: result._id,
          request: {
            type: 'GET',
            url: "http://localhost:3001/post/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });

}

exports.getAllPost = function (req, res) {
  PostModels.find()
    .select("name description")//sesuai sama model
    .then(docs => {
      const response = {
        count: docs.length,
        posts: docs.map(doc => {
          return {
            name: doc.name,
            // image: doc.image,
            description: doc.description,
            // hp: doc.hp,
            // mp: doc.mp,
            // atk: doc.atk,
            // def: doc.def,
            // acc: doc.acc,
            // spd: doc.spd,
            // _id: doc._id,
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}

exports.getCard = function (req, res) {
  const id = req.params.postId;
  PostModels.findById(id)
    .select('name description')
    .exec()
    .then(doc => {
      console.log("From database", doc.image);
      console.log("From database", doc.description);
      if (doc) {
        res.status(200).json({
          card: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:3001/post/get'
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
}