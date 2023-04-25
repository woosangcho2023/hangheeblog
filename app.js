const express = require("express");
const app = express();
//express 모듈을 불러와 app 객체 생성하기
const port = 3600;
//포트 설정
const routes = require("./routes/index");
//인덱스 파일 불러오기
const connect = require("./schemas");
//스테마스 파일 불러오기, 몽고연결
connect();

app.use(express.json());
//Json형식의 요청을 처리하기 위한 미들웨어 등록
app.use("/", routes);
//요청을 routes 모듈에서 처리하도곡 설정
app.get("/", (req, res) => {
  res.send("url에 /posts 를 추가해주세요!");
});
//Get 요청이 들어왔을 경우 메세지 출력
app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});

//서버를 실행.  정상적으로 열렸을때 메세지 출력