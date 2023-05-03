const express = require("express");
const Post = require("../schemas/post");
const Comment = require("../schemas/comment");
const cookieParser = require("cookie-parser");
const router = express.Router({ mergeParams: true });
router.use(cookieParser());


router.post("/signup", async (req, res) => {
    const { username, password, email } = req.body;
    if (username.length < 5 || username.length >= 25 ) {
        return res.status(400).json({ message: "5글자 이상, 24글자 미만의 닉네임을 설정해주세요" });
    }
    if (password.includes(username)) {
        return res.status(400).json({ message: "비밀번호에 닉네임을 포함할 수 없습니다." });
    }
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!regex.test(password)) {
        return res.status(400).json({ message: "비밀번호는 영어, 숫자, 특수문자를 모두 포함한 8자리 이상이어야 합니다." });
    }
    try {
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json({ message: "이미 사용 중인 닉네임입니다." });
    }
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


module.exports = router;