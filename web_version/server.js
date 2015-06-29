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

function strip_action(string) {
    return string.trim().slice(3, string.trim().length);
}

function take_action_handler(req, res) {
    console.log("action:", strip_action(req.body.action));
    console.log("place:", req.body.game_state.place);
    if (req.body.game_state.place == "the tavern" && 
        strip_action(req.body.action) == "Leave in a huff.") {
        console.log("you go to the streets");
    }
    var response = {"new_game": false,
                    "message": "You are soon assassinated.",
                    "options": {"a": "Play again."},
                   };
    res.json(response); 
}

var places = {"the tavern": ["the streets"],
              "the streets": ["the market", "the tower", "the church", 
                              "a dark alley", "the docks", "the countryside"],
              "the tower": ["the streets"],
              "the chuch": ["the streets"],
              "the docks": ["the streets", "the market", "the ocean", 
                            "the woods"],
              "the woods": ["the docks", "the countryside"],
             }            
                            
