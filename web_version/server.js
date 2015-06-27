var express = require('express'),
    http = require('http'),
    port = 3000,
    app,
    server;

app = express();
server = http.createServer(app);
server.listen(port);

app.use(express.urlencoded());
app.use(express.static(__dirname + "/client"));

console.log("Server started!");

app.post("/take_action.json", take_action_handler);

function take_action_handler(req, res) {
    console.log(req.body);
    var response = {"new_game": false,
                    "message": "You are soon assassinated.",
                    "options": {"a": "Play again."},
                   };
    res.json(response); 
}
