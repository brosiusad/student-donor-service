var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

// PostgreSQL setup and connection
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://abrosius:@localhost:5432/abrosius';
var client = new pg.Client(connectionString);
client.connect(function(err) {
    if (err) {
         return console.error('could not connect to postgres', err);
    }
    console.log('connected!');
});

app.all('*', function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Origin, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Content-Type", "application/json");
  next();
});

// Routes
app.get('/', function(req, res) {res.send('testing')});


app.listen(port);
