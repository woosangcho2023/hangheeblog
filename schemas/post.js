const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("Post", postsSchema);
//post_id로 이름 바꿔보기

// import mongoose from 'mongoose';
// const { Schema } = mongoose;

// const postSchema = new Schema({
// title:{
//     type: String,
//     required: true,
// },
// user: {
//     type: String,
//     required: true,
// },
// passward: {
//     type:String,
//     required: true,
// },
// content: {
//     type: String,
// },
// createdAt:{
//     type:Date,
//     default: Date.now,
// }


// });
// module.exports = mongoose.model('posts', ) 
// const blogSchema = new Schema({
//   title: String, // String is shorthand for {type: String}
//   author: String,
//   body: String,
//   comments: [{ body: String, date: Date }],
//   date: { type: Date, default: Date.now },
//   hidden: Boolean,
//   meta: {
//     votes: Number,
//     favs: Number
//   }
// });