const express = require("express")
//exprees 모듈 불러오기
const router = express.Router();
//Router 을 호출해서 객체 생성하기

router.post('/posts')

//post 요청이 들어왔을때 처리하는 핸들러 함수를 등록하는 코드


module.exports = router
//다른 모듈에서 사용할 수 있도록 객체를 모듈로 내보낸다.


