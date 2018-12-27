const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");

app.use(bodyParser.urlencoded({extended: false}));

// app.get("/style.css", (req, res) =>{
//     res.sendFile(__dirname + "/resources/style.css");
// });

// request GET => http://localhost:6969/
app.get("/", (request, response) => {
    const questions = JSON.parse(fs.readFileSync("./questions.json", {encoding: "utf-8"}));
    if (questions.length == 0) response.send("Chua co cau hoi nao !!");
    else{
        var i = Math.floor(Math.random() * questions.length);
        const randomQuestion = questions[i];
         // response.send(JSON.stringify({a:5, b:6}));
        // response.send(`<h1>
        // ${
        //      randomQuestion.content
        // }
        //  </h1>
        //  <a href="/vote/${randomQuestion.id}/yes"><button type="submit" name="vote" value="yes">Đúng/Có/Phải</button></a>
        //  <a href="/vote/${randomQuestion.id}/no"><button type="submit" name="vote" value ="no">Sai/Không/Trái</button></a>
        // `);
         response.sendFile(__dirname + "/view/answer.html");
    }
});

app.get("/api/random", (req,res) =>{
    const questions = JSON.parse(fs.readFileSync("./questions.json", {encoding: "utf-8"}));
    const randomQuestion =  questions[Math.floor(Math.random() * questions.length)];
    res.send({question: randomQuestion});
});

app.get("/question/:questionId", (req, res) => {
    const questions = JSON.parse(fs.readFileSync("./questions.json", {encoding: "utf-8"}));
    const questionId = req.params.questionId;
    questions.forEach((question, index) => {
        if (question.id == questionId){
            res.send(`
            <h1>${question.content}</h1>
            <p>yes:<span>${question.yes}</span></p>
            <p>no:<span>${question.no}</span></p>
            `);
        }
    })
});

app.get("/vote/:questionId/:vote", (req, res) => {
    const questions = JSON.parse(fs.readFileSync("./questions.json", {encoding: "utf-8"}));
    //params
    const questionId = req.params.questionId;
    const vote = req.params.vote;
    questions.forEach((question, index) => {
        if (question.id == questionId){
            questions[index][vote] ++;
        }
    });
    fs.writeFileSync("./questions.json", JSON.stringify(questions));
    res.redirect("/");
});

// app.post("/answer", (req, res) =>{
//     const questions = JSON.parse(fs.readFileSync("./questions.json", {encoding: "utf-8"}));
//     for(let i = 0; i < questions.length; i++){
//         if(i == req.body.id){
//             if(req.body.vote == "yes"){
//                 questions[i].yes ++;
//             }
//             if (req.body.vote == "no"){
//                 questions[i].no ++;
//             }
//             break;
//         }
//     }
//     console.log(questions);
//     fs.writeFileSync("./questions.json", JSON.stringify(questions));
//     res.redirect("/");
// });

app.get("/about", (req, res) =>{
    //Show ra trang CV
    res.sendFile(__dirname + "/resources/index.html");

});

app.get("/ask", (req, res) =>{
    res.sendFile(__dirname + "/view/ask.html");
});

app.post("/addquestion", (req, res) =>{
    const questions = JSON.parse(fs.readFileSync("./questions.json", {encoding: "utf-8"}));
    console.log(questions);
    const newQuestion = {
        content: req.body.questionContent,
        yes: 0,
        no: 0,
        id: questions.length
    };
    questions.push(newQuestion);
    console.log(questions);
    fs.writeFileSync("./questions.json", JSON.stringify(questions));
    res.redirect("/");
});

app.use(express.static("resources"));
//localhost:6969/public/...
app.use("/public",express.static("public"));

app.listen(6969, (err) => {
    if (err) console.log(err);
    else console.log("Server start success!");
});

