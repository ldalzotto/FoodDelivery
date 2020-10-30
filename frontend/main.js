var http = require("http");
var path = require("path");
var express = require("express");
var app = express();

var appDir = path.join(__dirname, "asset");
app.use(express.static("asset"));


app.get("*", (req, res) => {
    if (req.originalUrl.endsWith(".css")) {
        let l_stylepath = req.originalUrl.slice(req.originalUrl.indexOf("css/"), req.originalUrl.length);
        res.sendFile(path.join(appDir, l_stylepath));
    }
    else {
        res.sendFile(path.join(appDir, "index.html"));
    }
});

const port = 8081;

http.createServer(app).listen(port, () => {
    console.log( "Express server listening on port " + port );
    console.log( "http://localhost:" + port );
});