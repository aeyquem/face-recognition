import express from 'express';
import cors from 'cors';

let database = {
    users: [
        {
            "id": "123",
            "user": "jhon",
            "password": "macoy123",
            "entries": 0,
            "joined": new Date(),
            "email": "jhon@gmail.com"
        },
        {
            "id": "124",
            "user": "sally",
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
            res.json("logged in")
            return;
        }
    }
    res.status(400).send("error logging in");
})

app.post('/register', (req, res) => {
    const { user, email, password } = req.body;
    database.users.push({
        "user": user,
        "entries": 0,
        "joined": new Date(),
        "email": email
    });
    res.send(database.users[database.users.length - 1]);
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
    database.users.forEach(user => {
        if (user.id === id) {
            user.entries++;
            res.json(user.entries);
            return;
        }
    })
    res.status(404).send("no such user");
})

app.listen(3001, () => {
    console.log("running on port 3001");
})

