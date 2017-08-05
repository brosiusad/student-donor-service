var pg = require('pg');
var config = {
    user: 'postgres',
    password: 'postgres',
    database: 'Student-Donor',
    port: 5432,
    host: 'localhost'
}

var createStudentTableQuery =
    'CREATE TABLE Student (' +
    '    id SERIAL PRIMARY KEY,' +
    '    firstname text,' +
    '    lastname text NOT NULL,' +
    '    street text,' +
    '    city text,' +
    '    state text,' +
    '    zip text,' +
    '    age integer' +
    ')';

var createDonorTableQuery =
    'CREATE TABLE Donor (' +
    '    id SERIAL PRIMARY KEY,' +
    '    firstname text,' +
    '    lastname text NOT NULL,' +
    '    street text,' +
    '    city text,' +
    '    state text,' +
    '    zip text' +
    ')';

var createTripTableQuery =
    'CREATE TABLE Trip (' +
    '    id SERIAL PRIMARY KEY,' +
    '    name text,' +
    '    start_date date,' +
    '    end_date date' +
    ')';

var createTripAttendanceTableQuery =
    'CREATE TABLE TripAttendance (' +
    '    id SERIAL PRIMARY KEY,' +
    '    student_id integer REFERENCES Student (id) ON DELETE CASCADE,' +
    '    trip_id integer REFERENCES Trip (id) ON DELETE CASCADE' +
    ')';

var createDonationTableQuery =
    'CREATE TABLE Donation (' +
    '    id SERIAL PRIMARY KEY,' +
    '    donor_id integer REFERENCES Donor (id) ON DELETE CASCADE,' +
    '    trip_attendance_id integer REFERENCES TripAttendance (id) ON DELETE CASCADE,' +
    '    amount NUMERIC(7,2)' +
    ')';


var client = new pg.Client(config);
client.connect();

client.query(createStudentTableQuery);
client.query(createDonorTableQuery);
client.query(createTripTableQuery);
client.query(createDonationTableQuery);
client.query(createTripAttendanceTableQuery);