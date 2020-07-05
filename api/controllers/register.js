const handleRegister = (db, bcrypt) => (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return Promise.reject("error on register");
    }
    const hash = bcrypt.hashSync(password);
    return db.transaction(trx => {
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
                        return user[0];
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => Promise.reject(err));
}

const signInAuthentication = (db, bcrypt) => (req, res) => {
    const { authorization } = req.headers;
    return authorization ?
        getAuthToken() :
        handleRegister(req, res, db, bcrypt)
            .then(resp => resp.json())
            .catch(err => res.status(400).json(err))
}

module.exports = {
    signInAuthentication: signInAuthentication
};