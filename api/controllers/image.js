const submitImage = (req, res, db) => {
    const { id } = req.body;
    db.from('users')
        .where({ id })
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.json('unable to get entries').status(400));
}

export default submitImage;