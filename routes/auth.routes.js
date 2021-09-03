const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');
const passwordService = require('../passport');
const passport = require('passport');
const router = require('express').Router();

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

const signin = function (req, res, next) {
    // User has already had their email and password
    // We just need to give them a token
    res.json({ user: req.user, token: tokenForUser(req.user) });
};

const signup = function (req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).send({ error: 'You must provide email and password' });
    }

    // See if a user with the given email exists
    User.findOne({ email: email }, function (err, existingUser) {
        if (err) { return next(err); }

        // If a user with email does exist, return an error
        if (existingUser) {
            return res.status(422).send({ error: 'Email is in use' });
        }

        // If a user with email does NOT exist, create and save user record
        const user = new User(req.body);

        user.save(function (err) {
            if (err) { return next(err); }

            // Respond to request indicating the user was created
            res.json({ user: user, token: tokenForUser(user) });
        });
    });
};



const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });


router.post('/signin', requireSignin, signin);
router.post('/signup', signup);

router.get('/', requireAuth, (req, res, next) => {
    res.send(['water', 'phone', 'paper']);
});

module.exports = router;
