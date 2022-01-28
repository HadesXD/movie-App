
const express = require('express');
const mysql = require('mysql');
const app = express();

/*

app.listen('3000', () => {
    console.log('Server Started on port 3000');
})*/

// Create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'filmden-db'
});

// Connect to MySQL
db.connect(err => {
    if(err) {
        throw err
    }
    console.log('MySQL connected');
})


/*
// Insert employee
app.get('/user1', (req, res) => {
    let post = {firstName: "Domen", lastName: "Stropnik", emailAddress: "stropnik.domen99@gmail.com", pass: "nigga nigga"};
    let sql = 'INSERT INTO users SET ?';
    let query = db.query(sql, post, err => {
        if(err) throw err;
        res.send('User added');
    })
})*/