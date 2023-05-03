const express = require("express");
const Post = require("../schemas/post");
const Comment = require("../schemas/comment");
const cookieParser = require("cookie-parser");
const router = express.Router({ mergeParams: true });
router.use(cookieParser());











router.get("/posts", async (req, res) => {
    try {
    const posts = await Post.find().sort({ created_at: -1 });
    if (posts.length < 1) {
        return res.status(400).json({ message: "게시글이 없습니다!" });
    }
    const allPosts = posts.map((post) => {
        return {
            postId: post._id,
            title: post.title,
            content: post.content,
            createdBy: post.createdBy,
            createdAt: post.created_at,
        };
    });
    return res.json({ data: allPosts });
    } catch (err) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
    }
});

module.exports = router;