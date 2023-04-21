const express = require("express");
const router = express.Router();

const postsRouter = require("./post");
const commentsRouter = require("./comment");

router.use("/posts", postsRouter);

router.use("/posts/:_postId/comments", commentsRouter);

module.exports = router;
