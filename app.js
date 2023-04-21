const express = require("express")
const app = express();
const PORT = 3000;
const main = require('./schemas/index.js');
main()

app.get('/', (req, res) => {
    return res.status(200).json({"hello": "world"});
});


app.get('/',())

const p