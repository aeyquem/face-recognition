const getProfile = (req, res, db) => {
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
}

export default getProfile;