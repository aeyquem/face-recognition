import express from 'express';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcryptjs';

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

app.post('/signin', (req, res) => {
    db('login')
        .select('email', 'hash')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid) {
                return db.select('*')
                    .from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0]);
                    })
                    .catch(err => { res.status(400).json('unable to get user') })
            }
            else {
                res.status(400).json('wrong credentials')
            }
        })
        .catch(err => res.status(400).send("error logging in"));
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password, 0);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        "name": name,
                        "joined": new Date(),
                        "email": loginEmail[0]
                    }).then(user => {
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json('unable to register'));
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*')
        .from('users')
        .where({ id })
        .then(user => {
            console.log(user);
            if (user.length) {
                res.json(user[0]);
            }
            else {
                res.status(400).send('error getting user')
            }
        })
        .catch(err => res.status(400).send('error getting user'));
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db.from('users')
        .where({ id })
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.json('unable to get entries').status(400));
})

app.listen(3001, () => {
    console.log("running on port 3001");
})

