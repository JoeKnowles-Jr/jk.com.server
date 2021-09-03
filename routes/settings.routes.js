const router = require("express").Router();
const Settings = require("../models/settings.js");

router.get("/", (req, res) => {
    Settings.find({})
        .then(data => res.json({ settings: data }))
        .catch(err => res.json({ message: err }));
});

router.post("/", function (req, res) {
    Settings.create(req.body)
        .then(data => res.json({ settings: data }))
        .catch(err => res.json({ message: err }));
});

router.put("/", function (req, res) {
    const { update } = req.body;
    Settings.findOneAndUpdate({ name: update.name }, update, { new: true })
        .then(result => {
            Settings.find({})
                .then((err, settings) => {
                    res.json({ settings: settings, message: 'Settings updated' });
                })
                .catch(err => res.json({ message: err }))
        })
        .catch(err => console.log(err))
});

module.exports = router;
