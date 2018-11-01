const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const playlists = require('./routes/api/playlists');
const auth = require('./routes/api/auth');

const app = express();

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

app.get('/', (req, res) => res.send('hell1o4'));

// Passport middleware
app.use(passport.initialize());

// Use Routes
app.use('/api/users', users);
app.use('/api/playlists', playlists);
app.use('/api/auth', auth);

const port = process.env.PORT || 5050;

app.listen(port, () => console.log(`Server running on port ${port}`));
