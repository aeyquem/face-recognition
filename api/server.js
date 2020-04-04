const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const register = require('./controllers/register.js');
const signIn = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true
    }
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json(database.users);
})

app.post('/signin', (req, res) => signIn.signIn(req, res, db, bcrypt));

app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));

app.get('/profile/:id', (req, res) => profile.getProfile(req, res, db));

app.put('/image', (req, res) => image.submitImage(req, res, db));

app.post('/imageurl', (req, res) => image.handleApiCall(req, res, db));

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`running on port ${port}`);
})