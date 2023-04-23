const express = require("express");
const Post = require("../schemas/post");
const Comment = require("../schemas/comment");
const cookieParser = require("cookie-parser");
const router = express.Router({ mergeParams: true });
router.use(cookieParser());



router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const user = await User.create({
      username: username,
      password: password,
      email: email,
    });
    return res.json({ message: "회원가입이 완료되었습니다." });
  } catch (err) {
    return res.status(400).json({ message: "회원가입에 실패하였습니다." });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username, password: password });
    if (!user) {
      return res.status(400).json({ message: "로그인에 실패하였습니다." });
    }
    res.cookie("loggedIn", true); 
    return res.json({ message: "로그인에 성공하였습니다." });
  } catch (err) {
    return res.status(400).json({ message: "로그인에 실패하였습니다." });
  }
});


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



router.put("/:_commentId", async (req, res) => {
  const { _postId, _commentId } = req.params;
  const { password, content } = req.body;

  if (!req.cookies.loggedIn) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  if (_postId.length !== 24 || _commentId.length !== 24) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다1" });
  }
  if (!content) {
    return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
  }

  if (typeof password !== "string" || typeof content !== "string") {
    return res.status(400).json({ message: "데이터형식이 옳바르지 않습니다" });
  }

  try {

    const getComment = await Comment.findOne({
      _id: _commentId,
      postId: _postId,
    });

    if (!req.cookies.loggedIn) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    if (!getComment) {
      return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
    }
    if (getComment.password !== password) {
      return res.status(401).json({
        message: "비밀번호가 다릅니다",
      });
    }
    const updateComment = await Comment.updateOne(
      { _id: getComment._id },
      { content: content }
    );
    return res.json({ message: "댓글을 수정하셨습니다" });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

router.delete("/:_commentId", async (req, res) => {
  const { _postId, _commentId } = req.params;
  const { password } = req.body;

  if (_postId.length !== 24 || _commentId.length !== 24) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다1" });
  }

  if (!req.cookies.loggedIn) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  if (!password || typeof password !== "string") {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다2" });
  }
  try {
    const getComment = await Comment.findById({
      _id: _commentId,
      postId: _postId,
    });
    if (!getComment) {
      return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
    }
    if (getComment.password !== password) {
      return res.status(401).json({
        message:
          "데이터 형식이 올바르지 않습니다/ 개인적으로 비밀번호가 다릅니다.",
      });
    }
    await Comment.deleteOne({ _id: getComment._id });
    return res.json({ message: "댓글을 삭제하셨습니다." });
  } catch (err) {
    return res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다.",
    });
  }
});

module.exports = router;