const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieSession = require('cookie-session');

const playlists = require('./routes/api/playlists');
const auth = require('./routes/api/auth');
const spotify = require('./routes/api/spotify');

const cookieKey = require('./config/keys').cookieKey;

const app = express();

// Adds user to cookies
app.use(
    cookieSession({
        name: 'session',
        maxAge: 1.5 * 60 * 60 * 1000,
        keys: [cookieKey]
    })
);

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
const db = require('./config/keys').mongoURI;

// Connect to mongoDb
mongoose
    .connect(
        db,
        { useNewUrlParser: true }
    )
    .then(() => console.log('mongodb connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => res.send('hell1o-home'));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Use Routes
app.use('/api/playlists', playlists);
app.use('/api/auth', auth);
app.use('/api/spotify', spotify);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
