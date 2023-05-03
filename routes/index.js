const express = require("express");
const router = express.Router();

const postsRouter = require("./post");
const commentsRouter = require("./comment");
const deleteRouter = require("./delete");
const loginRouter = require("./login"); 
const signupRouter = require("./signup"); 

router.use("/posts", postsRouter);
router.use("/posts/:_postId/comments", commentsRouter);
router.use("/delete", deleteRouter);
router.use("/login", loginRouter); 
router.use("/signup", signupRouter); 

module.exports = router;