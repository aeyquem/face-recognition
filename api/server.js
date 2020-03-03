import express from 'express';

let database = {
    users: [
        {
            "id": "123",
            "user": "jhon",
            "password": "macoy123",
            "entries": 0,
            "registrationDate": new Date(),
            "email": "jhon@gmail.com"
        },
        {
            "id": "124",
            "user": "sally",
            "password": "macoy123",
            "entries": 0,
            "registrationDate": new Date(),
            "email": "sally@gmail.com"
        },
    ]
};


const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("this is working");
})

app.post('/signin', (req, res) => {
    if (req.body.user === database.users[0].user) {
        if (req.body.password === database.users[0].password) {
            res.send("logged in")
            return;
        }
    }
    res.status(400).send("error logging in");
})

app.post('/register', (req, res) => {
    const { user, email, password } = req.body;
    database.users.push({
        "user": user,
        "password": password,
        "entries": 0,
        "registrationDate": new Date(),
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

app.listen(3000, () => {
    console.log("running on port 3000");
})

