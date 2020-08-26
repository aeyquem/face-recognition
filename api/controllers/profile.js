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

const editProfile = (req, res, db) => {
    const { id } = req.params;
    const { name, email } = req.body.formInput;
    db('users')
        .where({ id })
        .update({ name, email })
        .then(resp => {
            if (resp) {
                res.json("success")
            }
            else {
                res.status(400).json("unable to update")
            }
        })
        .catch(err => {
            res.status(400).send("error")
        })
}

module.exports = {
    getProfile: getProfile,
    editProfile: editProfile
};