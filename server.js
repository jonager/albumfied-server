const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const playlists = require('./routes/api/playlists');

const app = express();

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

// Use Routes
app.use('/api/users', users);
app.use('/api/playlists', playlists);

const port = process.env.PORT || 5050;

app.listen(port, () => console.log(`Server running on port ${port}`));
