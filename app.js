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
//client.on('drain', client.end.bind(client)); //disconnect client when all queries are finished

client.connect(function(err) {
    if (err) {
         return console.error('could not connect to postgres', err);
    }
    console.log('connected!');
});

/* STUDENTS */

var listStudents = function(req, res){
    var row = client.query('SELECT * FROM student ORDER BY lastname, firstname', function (err, result) {
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
            console.log(err);
            res.send(404);
        } else {
            res.send(JSON.stringify(result.rows[0]));
        }
    });

};
var deleteStudent = function(req, res){

    var queryConfig = {
        text: 'DELETE FROM student WHERE id = $1',
        values: [req.params.id]
    };

    console.log('query: ' + queryConfig.text);
    console.log(queryConfig.values);

    client.query(queryConfig, function (error, result) {
        if (error) {
            console.log('query error: ' + error);
            res.send(404);
        } else {
            console.log(result);
            res.send(204);
        }
    });
};

var createStudent = function(req, res){
    console.log(req.body);
    console.log('age: ' + req.body.age);

    var student = req.body;
    console.log('age: ' + student.age);

    var queryConfig = {
        text: 'INSERT INTO student (firstname, lastname, street, city, state, zip, age) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        values: [student.firstname,
                student.lastname,
                student.street,
                student.city,
                student.state,
                student.zip,
                student.age === '' ? null : student.age]
    };

    console.log('query: ' + queryConfig.text);
    console.log(queryConfig.values);

    client.query(queryConfig, function (error, result) {
        if (error) {
            console.log('query error: ' + error);
            res.send(404);
        } else {
            res.send(JSON.stringify(result.rows[0]));
        }
    });
};

var updateStudent = function(req, res) {
    console.log(req.body);
    console.log('age: ' + req.body.age);

    var student = req.body;
    console.log('age: ' + student.age);

    var queryConfig = {
        text: 'UPDATE student SET firstname = $1, lastname = $2, street = $3, city = $4, state = $5, zip = $6, age = $7 WHERE id = $8 RETURNING *',
        values: [student.firstname,
                student.lastname,
                student.street,
                student.city,
                student.state,
                student.zip,
                student.age === '' ? null : student.age,
                student.id]
    };

    console.log('query: ' + queryConfig.text);
    console.log(queryConfig.values);

    client.query(queryConfig, function (error, result) {
        if (error) {
            console.log('query error: ' + error);
            res.send(404);
        } else {
            console.log('no query error');
            res.send(JSON.stringify(result.rows[0]));
        }
    });
};

/* DONORS */

var listDonors = function(req, res){
    var row = client.query('SELECT * FROM donor ORDER BY lastname, firstname', function (err, result) {
        if (err) {
            res.send(404);
        } else {
            res.send(JSON.stringify(result.rows));
        }
    });
};

var getDonor = function(req, res) {
    var row = client.query('SELECT * FROM donor WHERE id = $1', req.params.id, function (err, result) {
        if (err) {
            console.log(err);
            res.send(404);
        } else {
            res.send(JSON.stringify(result.rows[0]));
        }
    });

};
var deleteDonor = function(req, res){

    var queryConfig = {
        text: 'DELETE FROM donor WHERE id = $1',
        values: [req.params.id]
    };

    console.log('query: ' + queryConfig.text);
    console.log(queryConfig.values);

    client.query(queryConfig, function (error, result) {
        if (error) {
            console.log('query error: ' + error);
            res.send(404);
        } else {
            console.log(result);
            res.send(204);
        }
    });
};

var createDonor = function(req, res){
    console.log(req.body);

    var donor = req.body;

    var queryConfig = {
        text: 'INSERT INTO donor (firstname, lastname, street, city, state, zip) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        values: [donor.firstname,
                donor.lastname,
                donor.street,
                donor.city,
                donor.state,
                donor.zip]
    };

    console.log('query: ' + queryConfig.text);
    console.log(queryConfig.values);

    client.query(queryConfig, function (error, result) {
        if (error) {
            console.log('query error: ' + error);
            res.send(404);
        } else {
            res.send(JSON.stringify(result.rows[0]));
        }
    });
};

var updateDonor = function(req, res) {
    console.log(req.body);

    var donor = req.body;

    var queryConfig = {
        text: 'UPDATE donor SET firstname = $1, lastname = $2, street = $3, city = $4, state = $5, zip = $6 WHERE id = $7 RETURNING *',
        values: [donor.firstname,
                donor.lastname,
                donor.street,
                donor.city,
                donor.state,
                donor.zip,
                donor.id]
    };

    console.log('query: ' + queryConfig.text);
    console.log(queryConfig.values);

    client.query(queryConfig, function (error, result) {
        if (error) {
            console.log('query error: ' + error);
            res.send(404);
        } else {
            console.log('no query error');
            res.send(JSON.stringify(result.rows[0]));
        }
    });
};

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
