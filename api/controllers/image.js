const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '65715e9b297148bbb66e5893d3e589da'
});

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

const handleApiCall = (req, res) => {
    app.models.predict("a403429f2ddf4b49b307e318f00e528b", req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(400).json("error")
        });
}

module.exports = {
    submitImage: submitImage,
    handleApiCall: handleApiCall
};