const signIn = (req, res, db, bcrypt) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json("error on sign in");
    }

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
}

module.exports = {
    signIn: signIn
};