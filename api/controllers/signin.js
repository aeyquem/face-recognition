const jwt = require('jsonwebtoken');
const redis = require('redis');

const redisClient = redis.createClient(process.env.REDIS_URI);

const handleSignIn = (req, res, db, bcrypt) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return Promise.reject("error on sign in");
    }

    return db('login')
        .select('email', 'hash')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid) {
                return db.select('*')
                    .from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        return user[0];
                    })
                    .catch(err => Promise.reject('unable to get user'))
            }
            else {
                return Promise.reject('wrong credentials')
            }
        })
        .catch(err => Promise.reject("error logging in"));
}

const getAuthToken = (req, res) => {
    const { authorization } = req.headers;
    return redisClient.get(authorization, (err, reply) => {
        if (err || !reply) {
            return res.status(400).json('Unauthorized');
        }
        return res.json({ id: reply })
    })
}

const signToken = (email) => {
    const jwtPayload = { email };
    return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '2 days' });
}

const setToken = (key, value) => {
    return Promise.resolve(redisClient.set(key, value));
}

const createSession = (data) => {
    const { email, id } = data;
    const token = signToken(email);
    return setToken(token, id)
        .then(() => {
            return {
                success: 'true',
                userId: id,
                token
            }
        })
        .catch(console.log);
}

const signInAuthentication = (db, bcrypt) => (req, res) => {
    const { authorization } = req.headers;
    console.log(authorization)
    return authorization ?
        getAuthToken(req, res) :
        handleSignIn(req, res, db, bcrypt)
            .then(data => data.id && data.email ? createSession(data) : Promise.reject(data))
            .then(session => res.json(session))
            .catch(err => res.status(400).json(err))
}


module.exports = {
    signInAuthentication: signInAuthentication
};