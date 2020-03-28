import express from 'express';
import cors from 'cors';
import knex from 'knex';

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'localdb',
        database: 'smartbrain'
    }
});

let database = {
    users: [
        {
            "id": "123",
            "name": "jhon",
            "password": "macoy123",
            "entries": 0,
            "joined": new Date(),
            "email": "jhon@gmail.com"
        },
        {
            "id": "124",
            "name": "sally",
            "password": "macoy123",
            "entries": 0,
            "joined": new Date(),
            "email": "sally@gmail.com"
        },
    ]
};


const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json(database.users);
})

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email) {
        if (req.body.password === database.users[0].password) {
            res.json(database.users[0]);
        }
    }
    res.status(400).send("error logging in");
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    db('users')
        .returning('*')
        .insert({
            "name": name,
            "joined": new Date(),
            "email": email
        }).then(user => {
            res.json(user[0]);
        }).catch(err => res.status(400).json('unable to register'));
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    database.users.forEach(user => {
        if (user.id === id) {
            res.json(user);
            return;
        }
    })
    res.status(404).send("no such user");
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).send("no such user");
    }
})

app.listen(3001, () => {
    console.log("running on port 3001");
})

