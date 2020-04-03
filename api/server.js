const express = require('express');
const cors = ('cors');
const knex = ('knex');
const bcrypt = ('bcryptjs');
const register = ('./controllers/register.js');
const signIn = ('./controllers/signin.js');
const getProfile = ('./controllers/profile.js');
const image = ('./controllers/image.js');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'localdb',
        database: 'smartbrain'
    }
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json(database.users);
})

app.post('/signin', (req, res) => signIn(req, res, db, bcrypt));

app.post('/register', (req, res) => register(req, res, db, bcrypt));

app.get('/profile/:id', (req, res) => getProfile(req, res, db));

app.put('/image', (req, res) => image.submitImage(req, res, db));

app.post('/imageurl', (req, res) => image.handleApiCall(req, res, db));


app.listen(3001, () => {
    console.log("running on port 3001");
})