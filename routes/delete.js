const express = require("express");
const Post = require("../schemas/post");
const Comment = require("../schemas/comment");
const cookieParser = require("cookie-parser");
const router = express.Router({ mergeParams: true });
router.use(cookieParser());

router.put("/:_commentId", async (req, res) => {
    const { _postId, _commentId } = req.params;
    const { password, content } = req.body;
    const loggedInUserId = req.cookies.user_id;
    const comment = await Comment.findById(_commentId);
    const post = await Post.findById(_postId);
    const author = comment ? comment.createdBy : post.createdBy;


    if (!req.cookies.loggedIn) {
        return res.status(401).json({ message: "로그인이 필요합니다." });
}
    if (loggedInUserId !== author.toString()) {
        return res
        .status(403)
        .json({ message: "수정 권한이 없습니다." });
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
    const loggedInUserId = req.cookies.user_id;
    const comment = await Comment.findById(_commentId);
    const post = await Post.findById(_postId);
    const author = comment ? comment.createdBy : post.createdBy;

    if (_postId.length !== 24 || _commentId.length !== 24) {
            return res
            .status(400)
            .json({ message: "데이터 형식이 올바르지 않습니다1" });
}

    if (!req.cookies.loggedIn) {
        return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    if (loggedInUserId !== author.toString()) {
        return res
        .status(403)
        .json({ message: "수정 권한이 없습니다." });
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