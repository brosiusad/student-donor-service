var express = require('express');
var app = express.createServer();

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