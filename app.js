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
const { json } = require('body-parser');

// seting the ejs module and the static files
app.set('view engine', 'ejs');
app.use(express.static('public')); 

app.get('/', (req, res) => {
    /*
    if (localStorage.getItem("token") === null) {
        res.sendFile(__dirname + '/src/login.html');
      }*/
    res.sendFile(__dirname + '/src/index.html');
    //res.render('index');
})

app.get('/reg', (req, res) => {
    res.sendFile(__dirname + '/src/signup.html');
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/src/login.html');
})

app.get('/profile', (req, res) => {
    res.sendFile(__dirname + '/src/profile.html');
})

app.use(bodyParser.json());


/*
 * This function verifies that the user to be inserted in the MongoDB database is UNIUQE. 
 * If everything goes good, the user is redirected to the Login screen.
 */

app.post('/api/register', async (req, res) => {
    const { username, email, password: originalPassword, confirmPass } = req.body;
    const password = await bcrypt.hash(originalPassword, 10);

    if (!username || typeof username !== 'string') return res.json({ status: 'error', error: 'Invalid username.'});
    if (!originalPassword || typeof originalPassword !== 'string') return res.json({ status: 'error', error: 'Invalid password.'});
    if (originalPassword != confirmPass) return res.json({ status: 'error', error: 'The passwords do NOT match.'});
    if (originalPassword.length < 5) return res.json({ status: 'error', error: 'Password should be at least 6 characters.'});

    try {
        const response = await User.create({
            username,
            email,
            password
        }); console.log('User created sucessfully: ' + response);
    } catch (error) {
        // if there is a duplicate key
        if (error.code === 11000) return res.json({ status: 'error', error: 'Username is already in use' });
        throw error;
    }

    res.json({ status: 'ok' })
});

/*
 * This function verifies that the user data is correct for the login.
 * If everything goes good, the user is redirected to the Home screen.
 */

app.post('/api/login', async(req, res) => {
	const { username, password } = req.body
	const user = await User.findOne({ username }).lean()

	if (!user) return res.json({ status: 'error', error: 'Invalid username/password' })

	if (await bcrypt.compare(password, user.password)) {    // the username, password combination is successful
        const token = jwt.sign({
                id: user._id,
                username: user.username
            },JWT_SECRET) 
        
        return res.json({ status: 'ok', data: token })
	}

	res.json({ status: 'error', error: 'Invalid username/password' })
})


app.post('/api/get-favs', async (req, res) => {

    const { token } = req.body;

    try 
    {
        const user = jwt.verify(token, JWT_SECRET);
        const _id = user.id;

        const myObject = await User.find({_id: _id}, 'favorites -_id');
        
        //myObject[0].favorites.forEach(item =>  console.log("item: " + item));

        const favorites = JSON.stringify(myObject[0].favorites);
        res.json({ status: "ok", data: favorites })

    } catch (error) {
        console.log("eror: " + error);
        res.json({ status: 'error: ' + error });
    }


});

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

app.post('/api/get-user-data', async (req, res) => {
    const { token } = req.body;

    try 
    {
        const user = jwt.verify(token, JWT_SECRET);
        const _id = user.id;

        const myObject = await User.find({_id: _id});
        
        //myObject[0].favorites.forEach(item =>  console.log("item: " + item));



        res.json({ status: "ok", data: JSON.stringify(myObject) })

    } catch (error) {
        console.log("eror: " + error);
        res.json({ status: 'error: ' + error });
    }
})



app.post('/api/update', async (req, res) => {
    const { username, email, oldPassword, password: originalPassword, token } = req.body;

    console.log("our username uwu: " + originalPassword);
    if (!username || typeof username !== 'string') return res.json({ status: 'error', error: 'Invalid username.'});
    if (!originalPassword || typeof originalPassword !== 'string') return res.json({ status: 'error', error: 'Invalid password.'});
    if (originalPassword != oldPassword) return res.json({ status: 'error', error: 'Your new password should be New lol.'});
    if (originalPassword.length < 5) return res.json({ status: 'error', error: 'Password should be at least 6 characters.'});

    try {
		const user = jwt.verify(token, JWT_SECRET)
		const _id = user.id

		const password = await bcrypt.hash(originalPassword, 10)

		await User.updateOne(
			{ _id },
			{
				$set: { 
                    username,
                    email,
                    password 
                }
			}
		)
		res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: ';))' })
	}
});



app.listen(port, () => console.info(`Listening on port ${port}`));



