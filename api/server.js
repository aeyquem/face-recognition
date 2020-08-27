if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const register = require('./controllers/register.js');
const signIn = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');
const auth = require('./controllers/auth');


const db = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL
});

const app = express();

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    console.log(`requested: ${req.method} ${req.url}`);
    console.log(req.body);
    next();
})

app.get('/', (req, res) => {
    res.json("Server live");
})

app.post('/signin', signIn.signInAuthentication(db, bcrypt));

app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt))

app.get('/profile/:id', auth.requireAuth, (req, res) => profile.getProfile(req, res, db));
app.post('/profile/:id', auth.requireAuth, (req, res) => profile.editProfile(req, res, db));

app.put('/image', auth.requireAuth, (req, res) => image.submitImage(req, res, db));
app.post('/imageurl', auth.requireAuth, (req, res) => image.handleApiCall(req, res, db));

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`running on port ${port}`);
})