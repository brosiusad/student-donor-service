var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;

// parse application/json
app.use(bodyParser.json());

// PostgreSQL setup and connection
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://abrosius:@localhost:5432/Student-Donor';
var client = new pg.Client(connectionString);
client.on('drain', client.end.bind(client)); //disconnect client when all queries are finished

client.connect(function(err) {
    if (err) {
         return console.error('could not connect to postgres', err);
    }
    console.log('connected!');
});

/* STUDENTS */

var listStudents = function(req, res){
    var row = client.query('SELECT * FROM student', function (err, result) {
        if (err) {
            res.send(404);
        } else {
            res.send(JSON.stringify(result.rows));
        }
    });
};

var getStudent = function(req, res) {
    var row = client.query('SELECT * FROM student WHERE id = $1', req.params.id, function (err, result) {
        if (err) {
            res.send(404);
        } else {
            res.send(JSON.stringify(result.rows[0]));
        }
    });

};
var deleteStudent = function(req, res){};
var createStudent = function(req, res){};
var updateStudent = function(req, res){
    console.log(req.body);

    var student = req.body;

    var queryString = 'UPDATE student SET ' +
            'firstname = $1, ' +
            'lastname = $2, ' +
            'street = $3, ' +
            'city = $4, ' +
            'state = $5, ' +
            'zip = $6, ' +
            'age = $7 ' +
            'WHERE id = $8';

    var q = client.query(queryString,
                    student.firstname,
                    student.lastname,
                    student.street,
                    student.city,
                    student.state,
                    student.zip,
                    student.age,
                    student.id,
                    handleResult);

    function handleResult(error, result) {
        if (error) {
            res.send(404);
        } else {
            res.send(JSON.stringify(req.body));
        }
    });
};

/* DONORS */

var listDonors = function(req, res){};

var getDonor = function(req, res) {
    var row = client.query('SELECT * FROM donor WHERE id = $1', req.params.id, function (err, result) {
        if (err) {
            res.send(404);
        } else {
            res.send(JSON.stringify(result.rows[0]));
        }
    });

};
var deleteDonor = function(req, res){};
var createDonor = function(req, res){};
var updateDonor = function(req, res){};

/* TRIPS */

var listTrips = function(req, res){};

var getTrip = function(req, res) {
    var row = client.query('SELECT * FROM trip WHERE id = $1', req.params.id, function (err, result) {
        if (err) {
            res.send(404);
        } else {
            res.send(JSON.stringify(result.rows[0]));
        }
    });

};
var deleteTrip = function(req, res){};
var createTrip = function(req, res){};
var updateTrip = function(req, res){};


// express setup
app.all('*', function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Origin, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Content-Type", "application/json");
  next();
});

// Routes
app.get('/', function(req, res) {
    var query = client.query('SELECT * FROM Student');
    query.on('row', function(row) {
        console.log(row);

        if (!row) {
          return res.send('No data found');
        } else {
          res.send('lastname' + row.lastname);
        }
    });
});

app.get('/students', listStudents);
app.get('/students/:id', getStudent);
app.delete('/students/:id', deleteStudent);
app.post('/students', createStudent);
app.put('/students/:id', updateStudent);

app.get('/donors', listDonors);
app.get('/donors/:id', getDonor);
app.delete('/donors/:id', deleteDonor);
app.post('/donors', createDonor);
app.put('/donors/:id', updateDonor);

app.get('/trips', listTrips);
app.get('/trips/:id', getTrip);
app.delete('/trips/:id', deleteTrip);
app.post('/trips', createTrip);
app.put('/trips/:id', updateTrip);


app.listen(port);
