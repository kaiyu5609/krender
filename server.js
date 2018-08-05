var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, '/')));

app.listen(3200, function() {
    console.log('Project running at http://localhost:3200');
});

module.exports = app;
