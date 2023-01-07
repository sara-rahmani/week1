const fs = require("fs").promises;
const path = require("path");
const express = require('express')
const app = express()
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors({ origin: [/127.0.0.1*/, /localhost*/] }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Before the other routes
app.use(express.static("build2"))



const dataPath = path.join('data', 'quotes.json');
app.get("/", (req, res) => {
  console.log("GET /")
  res.send("<h1>Hello aws</h1>")
})
app.get("/api/pokemons", (req, res) => {
  fs.readFile(dataPath)
  .then((contents) => {
    console.log(contents);
    // need to parse the raw buffer as json if we want to work with it
    const quotesJSON = JSON.parse(contents);
    console.log(quotesJSON);
    //   prepare and send an OK response
    res.json(quotesJSON);
  })
  .catch((err) => {
    console.log(err);
    res.writeHead(500);
    res.end("Error");
  });
});


app.post("/api/pokemons", (req, res) => {
  const data = req.body
  console.log("POST /api/pokemons", data)
  // Storing the JSON format data in myObject
  fs.readFile(dataPath)
  .then((contents) => {
var myObject = JSON.parse(contents);
myObject.push(data);

  var newData = JSON.stringify(myObject);

  fs.writeFile(dataPath, newData, err => {
    // error checking
    if(err) throw err;
    
    console.log("New data added");
    res.render("/api/pokemons", {
      status: "received",
    });  })


});   
  // res.send(data)
});

// After all other routes
app.get('*', (req, res) => {
  res.sendFile('build2/index.html');
});
const port = process.env.PORT || 8081
app.listen(port, () => console.log(`listening on port ${port}`))
