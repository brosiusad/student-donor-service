var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/abrosius';

var createStudentTableQuery =
    'CREATE TABLE Student (
        id SERIAL PRIMARY KEY,
        firstname text,
        lastname text NOT NULL,
        street text,
        city text,
        state text,
        zip text,
        age integer
    )';

var createDonorTableQuery =
    'CREATE TABLE Donor (
        id SERIAL PRIMARY KEY,
        firstname text,
        lastname text NOT NULL,
        street text,
        city text,
        state text,
        zip text
    )';

var createTripTableQuery =
    'CREATE TABLE Trip (
        id SERIAL PRIMARY KEY,
        name text,
        start_date date,
        end_date date
    )';

var createDonationTableQuery =
    'CREATE TABLE Donation (
        id SERIAL PRIMARY KEY,
        donor_id REFERENCES Donor (id),
        trip_attendance_id REFERENCES TripAttendance (id),
        amount NUMERIC(7,2)
    )';

var createTripAttendanceTableQuery =
    'CREATE TABLE TripAttendance (
        id SERIAL PRIMARY KEY,
        student_id REFERENCES Student (id),
        trip_id REFERENCES Trip (id),
    )';


var client = new pg.Client(connectionString);
client.connect();

client.query(createStudentTableQuery);
client.query(createDonorTableQuery);
client.query(createTripTableQuery);
client.query(createDonationTableQuery);
client.query(createTripAttendanceTableQuery);