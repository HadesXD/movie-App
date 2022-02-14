// import & parameters
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'lalalalalal';
const { application } = require('express');

const app = express();
const port = 3000;
//const urlencodedParser = bodyParser.urlencoded({ extended: false }); // for POST handling

const mongoose = require('mongoose');

/*
mongoose.connect('mongodb://localhost:27017/my-db', function() {
    /* Drop the DB 
    console.log("This: " + mongoose.connection.db);
    mongoose.connection.db.dropDatabase();
});*/

mongoose.connect('mongodb://localhost:27017/my-db',  {
    family: 4,
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const User = require('./models/user');

// seting the ejs module and the static files
app.set('view engine', 'ejs');
app.use(express.static('public')); 

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
})

app.get('/reg', (req, res) => {
    res.sendFile(__dirname + '/src/signup.html');
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/src/login.html');
})

app.use(bodyParser.json());

app.post('/api/register', async (req, res) => {

    const { username, email, password: originalPassword } = req.body;
    const password = await bcrypt.hash(originalPassword, 10);

    if (!username || typeof username !== 'string') return res.json({ status: 'error', error: 'Invalid username.'});
    if (!originalPassword || typeof originalPassword !== 'string') return res.json({ status: 'error', error: 'Invalid password.'});
    if (originalPassword.length < 5) return res.json({ status: 'error', error: 'Password should be at least 6 characters.'});

    try {
        
        const response = await User.create({
            username,
            email,
            password
        });
        console.log('User created sucessfully: ' + response);
    } catch (error) {
        // duplicate key
        if (error.code === 11000) return res.json({ status: 'error', error: 'Username is already in use' });
        throw error;
    }

    res.json({ status: 'ok' })
});

app.post('/api/login', async(req, res) => {
	const { email, password } = req.body
	const user = await User.findOne({ email }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful

		const token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			JWT_SECRET
		)

		return res.json({ status: 'ok', data: token })
	}

	res.json({ status: 'error', error: 'Invalid username/password' })
})

app.post('/api/update-fav', async (req, res) => {
    const { token } = req.body;
    const { cardID } = req.body;
    console.log("this token: " + token + "\ncardID: " +cardID);
    try {
        const user = jwt.verify(token, JWT_SECRET);
        console.log("user: " + user.id);
        const _id = user.id;

        await User.updateOne(
            { _id }, 
            { $push: { favorites: cardID } }
        );
    } 
    catch (error) {
        console.log("error: " + error);
        res.json({ status: 'error: ' + error });
    }


    res.json({ status: 'ok' })
})

app.listen(port, () => console.info(`Listening on port ${port}`));



