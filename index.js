// ==============================================================================
//                                  DEPENDENCIES
// ==============================================================================
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("./config.json");

// -------------------------------------Schemas-----------------------------------
const WildlifePost = require("./models/wildlife-post.js");
const User = require("./models/user.js");
const Comment = require("./models/comment.js");

// ----------------------------------Start Dependencies---------------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// -----------------------------------Start Server--------------------------------
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// ---------------------------------Connect to MongoDB----------------------------
mongoose
  .connect(
    `mongodb+srv://${config.username}:${config.password}@sum3db.cx7l0zw.mongodb.net/Wētāverse?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log(`You've connected to MongoDB!`);
  })
  .catch((err) => {
    console.log(`DB connection error ${err.message}`);
  });

// var moment = require('moment'); // require
// moment().format();

// ==============================================================================
//                                  GET METHOD
// ==============================================================================
app.get("/allWildlifePosts", (req, res) => {
  WildlifePost.find().then((result) => {
    res.send(result);
  });
});

//===============================================================================
//                                  ADD METHOD
//===============================================================================

app.post(`/addWildlifePost`, (req, res) => {
  // create a new instance of the student schema
  const newWildlifePost = new WildlifePost({
    // give our new student the details we sent from the frontend
    _id: new mongoose.Types.ObjectId(),
    image_url: req.body.image_url,
    title: req.body.title,
    location: req.body.location,
    caption: req.body.caption,
    author_name: req.body.author_name,
    author_image_url: req.body.author_image_url,
    author_id: req.body.author_id,
    // created: req.body.created
  });
  // to save the newstudent to the database
  // use the variable declared above
  newWildlifePost
    .save()
    .then((result) => {
      console.log(`Added a new post successfully!`);
      // return back to the frontend what just happened
      res.send(result);
    })
    .catch((err) => {
      console.log(`Error: ${err.message}`);
    });
});

//===========================================================================
//                               EDIT METHOD
//===========================================================================

app.patch("/updatePost/:id", (req, res) => {
  const idParam = req.params.id;
  WildlifePost.findById(idParam, (err, wildlifePost) => {
    const updatedProduct = {
      title: req.body.title,
      location: req.body.location,
      caption: req.body.caption,
    };
    WildlifePost.updateOne(
      {
        _id: idParam,
      },
      updatedProduct
    )
      .then((result) => {
        res.send(result);
      })
      .catch((err) => res.send(err));
  });
});

// =======================
//    GET SINGLE POST
// =======================

app.get('/wildlifePost/:id', (req, res) => {
  const selectedPostId = req.params.id
  WildlifePost.findById(selectedPostId, (err, wildlifePost) => {
    if (err) {
      console.log(err);
    } else {
      res.send(wildlifePost);
    }
  })
})

// ==============================================================================
//                                 SIGN UP USERS
// ==============================================================================
app.post("/registerUser", (req, res) => {
  // Checking if user is in the DB already

  User.findOne({ username: req.body.username }, (err, userResult) => {
    if (userResult) {
      // send back a string so we can validate the user
      res.send("username exists");
    } else {
      const hash = bcrypt.hashSync(req.body.password); // Encrypt User Password
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        password: hash,
        profile_image_url: req.body.profile_image_url,
      });

      user
        .save()
        .then((result) => {
          // Save to database and notify userResult
          res.send(result);
        })
        .catch((err) => res.send(err));
    } // Else
  });
}); // End of Create Account

// ==============================================================================
//                                  LOGIN
// ==============================================================================
app.post("/loginUser", (req, res) => {
  User.findOne({ username: req.body.username }, (err, userResult) => {
    if (userResult) {
      if (bcrypt.compareSync(req.body.password, userResult.password)) {
        res.send(userResult);
      } else {
        res.send("not authorised");
      } // inner if
    } else {
      res.send("user not found");
    } // outer if
  }); // Find one ends
}); // end of post login

//==========================================================
//                         COMMENTS
//==========================================================

//add a new review
app.post("/postComment", (req, res) => {
  const newComment = new Comment({
    _id: new mongoose.Types.ObjectId(),
    text: req.body.text,
    comment_author_id: req.body.comment_author_id,
    comment_author_name: req.body.comment_author_name,
    comment_author_image_url: req.body.comment_author_image_url,
    wildlife_post_id: req.body.wildlife_post_id,
  });
  // save (or post) this review to the mongo database
  newComment.save().then((result) => {
    WildlifePost.findByIdAndUpdate(
      // first parameter is the id of the coffee you want to find
      newComment.wildlife_post_id,
      { $push: { comments: newComment } }
    )
      .then((result) => {
        res.send(newComment);
      })
      .catch((error) => {
        res.send(error);
      });
  });
});

// =====================
//     DELETE Method
// ====================

// set up the delete route
// This route will only be actived if someone goes to it
// you can go to it using AJAX
app.delete("/deleteWildlifePost/:id", (req, res) => {
  // the request varible here (req) contains the ID, and you can access it using req.param.id
  const selectedPostId = req.params.id;
  console.log("The following wildlife post was deleted:");
  console.log(selectedPostId);
  // findById() looks up a piece of data based on the id aurgument which we give it first
  // we're giving it the coffee ID vairiblew
  //  if it successful it will run a function
  // then function will provide us the details on that coffee or an error if it doesn't work
  WildlifePost.findById(selectedPostId, (err, wildlifePost) => {
    if (err) {
      console.log(err);
    } else {
      console.log(wildlifePost);
      WildlifePost.deleteOne({ _id: selectedPostId })
        .then(() => {
          console.log("Success! Actually deleted from mongoDB");
          // res.send will end the process
          res.send(wildlifePost);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
});
