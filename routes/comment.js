const express = require("express");
const Post = require("../schemas/post");
const Comment = require("../schemas/comment");
const cookieParser = require("cookie-parser");
const router = express.Router({ mergeParams: true });
router.use(cookieParser());







router.post("/", async (req, res) => {
  const { user, password, content } = req.body;
  const { _postId } = req.params;

  if (!req.cookies.loggedIn) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  if (_postId.length !== 24) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
  }
  if (!content) {
    return res.status(400).json({ message: "댓글을 내용을 입력해주세요" });
  }
  if (
    !user ||
    !password ||
    typeof password !== "string" ||
    typeof user !== "string" ||
    typeof content !== "string"
  ) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
  }

  try {
    const checkPost = await Post.findById({ _id: _postId });

    if (!req.cookies.loggedIn) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    if (!checkPost) {
      return res.status(400).json({ message: "게시글이 없습니다!" });
    }
    const postComment = await Comment.create({
      postId: checkPost._id,
      user: user,
      password: password,
      content: content,
      createdBy: req.cookies.user_id 
    });
    return res.json({ message: "댓글을 생성하였습니다" });
  } catch (err) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
  }
});



router.get("/", async (req, res) => {
  const { _postId } = req.params;

  if (!req.cookies.loggedIn) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }
  

  if (_postId.length !== 24) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
  }

  try {
    const getComments = await Comment.find({ postId: _postId }).sort({
      created_at: -1,
    });
    if (getComments.length < 1) {
      return res.status(400).json({ message: "댓글이 아직 없습니다!" });
    }
    const allComments = getComments.map((getComment) => {
      return {
        commentId: getComment._id,
        user: getComment.user,
        content: getComment.content,
        createdAt: getComment.created_at,
      };
    });
    return res.json({ data: allComments });
  } catch (err) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
  }
});




module.exports = router;