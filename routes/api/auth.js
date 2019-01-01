const express = require('express');
const router = express.Router();
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;

const clientId = require('../../config/keys').clientId;
const clientSecret = require('../../config/keys').clientSecret;

// Load user model
const User = require('../../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id); // Id from mongodb, not spotify
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});

passport.use(
    new SpotifyStrategy(
        {
            clientID: clientId,
            clientSecret: clientSecret,
            callbackURL: 'http://localhost:5000/api/auth/callback/'
        },
        function(accessToken, refreshToken, expires_in, profile, done) {
            User.findOne({ spotifyId: profile.id }).then(currentUser => {
                if (currentUser) {
                    User.findOneAndUpdate(
                        { spotifyId: profile.id },
                        {
                            $set: {
                                accessToken: accessToken,
                                refreshToken: refreshToken
                            }
                        },
                        { new: true }
                    )
                        .then(updatedUser => done(null, updatedUser))
                        .catch(err => console.log(err));
                } else {
                    const newUser = new User({
                        spotifyId: profile.id,
                        accessToken,
                        refreshToken
                    });

                    newUser
                        .save()
                        .then(() => done(null, newUser))
                        .catch(err => console.log(err));
                }
            });
        }
    )
);

router.get(
    '/spotify',
    passport.authenticate('spotify', {
        scope: [
            'user-library-read',
            'user-library-modify',
            'user-read-email',
            'streaming',
            'user-read-birthdate',
            'user-read-private',
            'user-read-currently-playing'
        ],
        showDialog: true
    }),
    function(req, res) {
        // The request will be redirected to spotify for authentication, so this
        // function will not be called.
    }
);

router.get(
    '/callback',
    passport.authenticate('spotify', {
        failureRedirect: '/'
    }),
    function(req, res) {
        // Successful authentication, redirect to front-end.
        res.redirect(
            `http://localhost:3000/callback?spotifyId=${
                req.user.spotifyId
            }&spotifyToken=${req.user.accessToken}`
        );
    }
);

module.exports = router;
