const router = require("express").Router();
const User = require("../models/user.js");

router.get("/", (req, res) => {
    User.find({})
        .then(users => res.json({ users: users}))
    .catch(err => res.json({message: err}));
});

router.post("/", function (req, res) {
    User.create(req.body)
        .then(u => {
            User.find({})
                .then(users => {
                    res.json({ message: 'User inserted!', users: users })
                })
                .catch(err => console.log(err))
        })
        .catch(err => res.json(err))
});

router.put("/", function (req, res) {
    const uid = req.body.filter;
    const update = req.body.update;

    User.findOneAndUpdate({ _id: uid }, update, { new: true })
        .then(result => {
            User.find({})
                .then(users => {
                    res.json({ message: "User deleted", users: users })
                })
                .catch(err => res.json({ message: err }))
        })
        .catch(err => console.log(err))
});

router.delete("/:uid", function (req, res) {
    User.findByIdAndDelete({ _id: req.params.uid })
        .then(() => {
            User.find({})
                .then(users => {
                    res.json({ message: "User deleted", users: users })
                })
                .catch(err => res.json({ message: err }))
        })
        .catch(err => {
            res.json(err);
        });
});

module.exports = router;
