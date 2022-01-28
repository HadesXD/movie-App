// import & parameters
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const urlencodedParser = bodyParser.urlencoded({ extended: false }); // for POST handling

// seting the ejs module and the static files
app.set('view engine', 'ejs');
app.use(express.static('public')); 

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
})

// SIGNUP
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', urlencodedParser, function(req, res) {
    console.log(req.body);
});





app.get('/profile/:name', (req, res) => {
    res.render('profile', {person: req.params.name});
})

// Listen on Port 3000
app.listen(port, () => console.info(`Listening on port ${port}`));

/*
// Start Files
app.use(express.static('src'));
app.use('/styles/css', express.static(__dirname + 'src/styles/css'));
app.use('/js', express.static(__dirname + 'src/js'));
app.use('/images', express.static(__dirname + 'src/images'));

app.set('src', './src');
app.set('view engine', 'ejs');


/*

let http = require('http');
let fs = require('fs');

let server = http.createServer(function(req, res) {
    console.log("Request was made: " + req.url);
    res.writeHead(200, {'Content-Type': 'text/html'});
    let myReadStream = fs.createReadStream(__dirname + '/src/register.html', 'utf8');
    myReadStream.pipe(res);
});

server.listen(3000, '127.0.0.1');
console.log("You niggers, now listening to port 3000!")
*/