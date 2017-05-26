var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;

// parse application/json
app.use(bodyParser.json());

// PostgreSQL setup and connection
var pg = require('pg');
//var connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/Student-Donor';
var config = {
    user: 'postgres',
    password: 'postgres',
    database: 'Student-Donor',
    port: 5432,
    host: 'localhost'
}
var client = new pg.Client(config);
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
    console.log(req.params.id);
    var row = client.query('SELECT * FROM student WHERE id = $1', [req.params.id], function (err, result) {
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
    var row = client.query('SELECT * FROM donor WHERE id = $1', [req.params.id], function (err, result) {
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

var listTrips = function(req, res){
    var row = client.query('SELECT * FROM trip ORDER BY start_date DESC', function (err, result) {
        if (err) {
            res.send(404);
        } else {
            res.send(JSON.stringify(result.rows));
        }
    });
};

var getTrip = function(req, res) {
    var row = client.query('SELECT * FROM trip WHERE id = $1', [req.params.id], function (err, result) {
        if (err) {
            console.log(err);
            res.send(404);
        } else {
            res.send(JSON.stringify(result.rows[0]));
        }
    });

};
var deleteTrip = function(req, res){

    var queryConfig = {
        text: 'DELETE FROM trip WHERE id = $1',
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

var createTrip = function(req, res){
    console.log(req.body);

    var trip = req.body;

    var queryConfig = {
        text: 'INSERT INTO trip (name, start_date, end_date) VALUES ($1, $2, $3) RETURNING *',
        values: [trip.name,
                trip.start_date === '' ? null : trip.start_date,
                trip.end_date === '' ? null : trip.end_date]
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

var updateTrip = function(req, res) {
    console.log(req.body);

    var trip = req.body;

    var queryConfig = {
        text: 'UPDATE trip SET name = $1, start_date = $2, end_date = $3 WHERE id = $4 RETURNING *',
        values: [trip.name,
                trip.start_date === '' ? null : trip.start_date,
                trip.end_date === '' ? null : trip.end_date,
                trip.id]
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

/* Trip Attendances */

var listTripAttendances = function(req, res) {

    // are we querying from a student or donor perspective?
    var perspective;
    var theId;
    if (req.query.studentId) {
        theId = req.query.studentId;
        perspective = 'student';
    } else if (req.query.tripId) {
        theId = req.query.tripId;
        perspective = 'trip';
    } else {
        //res.send(404);
    }

    var idSearchTerm = (perspective === 'student' ? 'student_id' : 'trip_id');

    var self = this;
    var taRows;
    var donationRows;
    var results;

    // query for tripattendance rows for student
    var row = client.query( 'SELECT ' +
                            '  tripattendance.id id, ' +
                            '  trip.id trip_id, ' +
                            '  student.id student_id, ' +
                            '  trip.name, ' +
                            '  trip.start_date, ' +
                            '  trip.end_date, ' +
                            '  student.firstname, ' +
                            '  student.lastname, ' +
                            '  student.city, ' +
                            '  student.state ' +
                            'FROM ' +
                            '  tripattendance, ' +
                            '  trip, ' +
                            '  student ' +
                            'WHERE ' +
                            '  tripattendance.student_id = student.id AND' +
                            '  tripattendance.trip_id = trip.id AND ' +
                            '  ' + idSearchTerm + ' = $1',
                            [theId],
    function (err, result) {
        if (err) {
            console.log(err);
            res.send(404);
        } else {
            // cache query result
            self.taRows = result.rows;
            console.log('self.taRows: ' + JSON.stringify(self.taRows));
            //res.send(JSON.stringify(result.rows));

        }
    });

    // query for sum of donation amounts per trip for student
    var row = client.query( 'SELECT ' +
                            '    sum(amount) total, ' +
                            '    trip_attendance_id ' +
                            'FROM ' +
                            '    donation ' +
                            'WHERE ' +
                            '    trip_attendance_id IN (SELECT trip_attendance_id FROM tripattendance WHERE ' + idSearchTerm + ' = $1) ' +
                            'GROUP BY' +
                            '    trip_attendance_id ',
                            [theId],
    function (err, result) {
        if (err) {
            console.log(err);
            res.send(404);
        } else {
            self.donationRows = result.rows;
            console.log('self.donationRows: ' + JSON.stringify(self.donationRows));
            combineResults();
            returnResults();

        }
    });

    // combine results
    var combineResults = function() {
        var l = self.taRows.length
        for (var i = 0; i < l; i++) {
            console.log('taRow: ' + JSON.stringify(self.taRows[i]));
            var filteredDonationRows = self.donationRows.filter(function(val, ind, arr) {
                console.log('val in donationRows: ' + JSON.stringify(val));
                return val.trip_attendance_id === self.taRows[i].id;
            }, this);

            console.log('filteredDonationRows: ' + JSON.stringify(filteredDonationRows));

            if (filteredDonationRows.length > 0) {
                self.taRows[i].total = filteredDonationRows[0].total;
            } else {
                self.taRows[i].total = 0;
            }

        }
        console.log('taRows: ' + JSON.stringify(self.taRows));
    }

    var returnResults = function() {
        if (self.taRows) {
            res.send(JSON.stringify(self.taRows));
        } else {
            res.send(404);
        }
    }

};

var createTripAttendance = function(req, res) {
    var tripattendance = req.body;

    var queryConfig = {
        text: 'INSERT INTO tripattendance (student_id, trip_id) VALUES ($1, $2) RETURNING *',
        values: [tripattendance.student_id,
                tripattendance.trip_id]
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

var deleteTripAttendance = function(req, res) {
    var tripattendance = req.body;

    var queryConfig = {
        text: 'DELETE FROM tripattendance WHERE id = $1',
        values: [req.params.id]
    };

    console.log('query: ' + queryConfig.text);
    console.log(queryConfig.values);

    client.query(queryConfig, function (error, result) {
        if (error) {
            // TODO: find and delete all donation records with a ref. to this tripattendance record

            console.log('query error: ' + error);
            res.send(404);
        } else {
            console.log(result);
            res.send(204);
        }
    });
};

/* Donations */
var listDonations = function(req, res) {
    var studentId = req.query.studentId;
    var tripId = req.query.tripId;
    var donorId = req.query.donorId;

    var tripattendanceQuery = (studentId && tripId) ? true : false;
    var donorQuery = donorId ? true : false;

    var queryString =   'SELECT ' +
                        '   donation.id id, ' +
                        '   amount, ' +
                        '   donor_id, ' +
                        '   donor.firstname donor_firstname, ' +
                        '   donor.lastname donor_lastname, ' +
                        '   donor.street, ' +
                        '   donor.city, ' +
                        '   donor.state, ' +
                        '   donor.zip, ' +
                        '   trip_attendance_id, ' +
                        '   trip.name trip_name, ' +
                        '   trip.start_date, ' +
                        '   trip.end_date, ' +
                        '   tripattendance.student_id, ' +
                        '   tripattendance.trip_id, ' +
                        '   student.lastname student_lastname, ' +
                        '   student.firstname student_firstname ' +
                        'FROM ' +
                        '   donation, ' +
                        '   donor, ' +
                        '   tripattendance, ' +
                        '   trip, ' +
                        '   student ' +
                        'WHERE ' +
                        '   donation.donor_id = donor.id AND ' +
                        '   donation.trip_attendance_id = tripattendance.id AND ' +
                        '   tripattendance.trip_id = trip.id AND ' +
                        '   tripattendance.student_id = student.id ';

    if (tripattendanceQuery) {
        queryString +=  'AND ' +
                        '   tripattendance.student_id = $1 AND' +
                        '   tripattendance.trip_id = $2';

        console.log('running query');
        var query = client.query(queryString, [studentId, tripId], function (err, result) {
            if (err) {
                console.log(err);
                res.send(404);
            } else {
                console.log('no error');
                res.send(JSON.stringify(result.rows));
            }
        });

    } else if (donorId) {
        queryString +=  'AND ' +
                        '   donation.donor_id = $1 ' +
                        '   ORDER BY trip.start_date';

        console.log('running query');
        var query = client.query(queryString, [donorId], function (err, result) {
            if (err) {
                console.log(err);
                res.send(404);
            } else {
                console.log('no error');
                res.send(JSON.stringify(result.rows));
            }
        });
    } else {
        res.send(404);
    }

    console.log(queryString);
};

var createDonation = function(req, res) {
    var donation = req.body;

    var queryConfig = {
        text: 'INSERT INTO donation (trip_attendance_id, donor_id, amount) VALUES ($1, $2, $3) RETURNING *',
        values: [donation.trip_attendance_id,
                donation.donor_id,
                donation.amount]
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

var deleteDonation = function(req, res) {
    var donation = req.body;

    var queryConfig = {
        text: 'DELETE FROM donation WHERE id = $1',
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

// passed either studentId or tripId as a query param
app.get('/tripattendances', listTripAttendances);

app.post('/tripattendances', createTripAttendance);
app.delete('/tripattendances/:id', deleteTripAttendance);

// optionally passed studentId and tripId as query params to limit query
app.get('/donations', listDonations);

app.post('/donations', createDonation);
app.delete('/donations/:id', deleteDonation);

app.listen(port);
