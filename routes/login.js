const express = require("express");
const Post = require("../schemas/post");
const Comment = require("../schemas/comment");
const cookieParser = require("cookie-parser");
const router = express.Router({ mergeParams: true });
router.use(cookieParser());


router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username: username, password: password });
        if (!user) {
        return res.status(400).json({ message: "닉네임 또는 패스워드를 확인해주세요." });
    }
    res.cookie("loggedIn", true); 
    res.cookie("user_id", user._id);
    return res.json({ message: "로그인에 성공하였습니다." });
} catch (err) {
    return res.status(400).json({ message: "로그인에 실패하였습니다." });
}
});

module.exports = router;