const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load Playlist Model
const Playlist = require('../../models/Playlist');

// middleware to check auth
const authCheck = (req, res, next) => {
    if (!req.user) {
        // if user is not loggin
        res.redirect('/');
    } else {
        next();
    }
};

// @route GET api/playlists
// @description  Returns all playlists for current user
// @acces Private
router.get('/', authCheck, (req, res) => {
    Playlist.find()
        .sort({ date: -1 })
        .then(playlists => res.json(playlists))
        .catch(err =>
            res.status(404).json({ noplaylistfound: 'No playlists found' })
        );
});

// @route GET api/playlists/:playlist_id
// @description  Returns playlist by id
// @acces Private
router.get('/:playlist_id', authCheck, (req, res) => {
    Playlist.findById(req.params.playlist_id)
        .then(playlist => res.json(playlist))
        .catch(err =>
            res
                .status(404)
                .json({ noplaylistfound: 'No playlist found with that Id' })
        );
});

// @route POST api/playlists
// @description  Create a new playlist
// @access Private
router.post('/', authCheck, (req, res) => {
    Playlist.findOne({ name: req.body.name }).then(playlist => {
        if (playlist) {
            return res.status(400).json({
                nameTaken: 'A playlist with that name already exists'
            });
        } else {
            const newPlaylist = new Playlist({
                user: req.user.id,
                name: req.body.name
            });

            newPlaylist.save().then(playlist => {
                res.json(playlist);
            });
        }
    });
});

// @route POST api/playlists/album/:id
// @description  Add album to playlist
// @access Private
router.post('/album/:playlist_id', authCheck, (req, res) => {
    Playlist.findById(req.params.playlist_id)
        .then(playlist => {
            let albumExists = false;

            for (album of playlist.albums) {
                if (album.albumId === req.body.albumId) {
                    albumExists = true;
                    break;
                }
            }

            if (albumExists) {
                return res.status(400).json({
                    albumexists: 'Album is already in playlist'
                });
            }

            const newAlbum = {
                albumId: req.body.albumId,
                albumImgURI: req.body.albumImgURI,
                albumName: req.body.albumName,
                artistId: req.body.artistId,
                artistName: req.body.artistName
            };

            // Add to comments array
            playlist.albums.unshift(testAlbum);

            // Save
            playlist.save().then(playlist => res.json(playlist));
        })
        .catch(err =>
            res.status(404).json({ playlistnotfound: 'No playlist found' })
        );
});

// @route DELETE api/playlists/:id
// @description  Delete playlist
// @access Private
router.delete('/:playlist_id', authCheck, (req, res) => {
    Playlist.findById(req.params.playlist_id)
        .then(playlist => {
            // Check for playlist owner
            if (playlist.user.toString() !== req.user.id) {
                return res
                    .status(401)
                    .json({ noauthorized: 'User not authorized' });
            }
            playlist.remove().then(() => res.json({ success: true }));
        })
        .catch(err =>
            res.status(404).json({ noplaylistfound: 'No playlist found' })
        );
});

// @route DELETE api/playlists/:playlist_id/:album_id
// @description  Delete album from playlist
// @access Private
router.delete('/:playlist_id/:album_id', authCheck, (req, res) => {
    Playlist.findById(req.params.playlist_id)
        .then(playlist => {
            // Check for playlist owner
            if (playlist.user.toString() !== req.user.id) {
                return res
                    .status(401)
                    .json({ noauthorized: 'User not authorized' });
            }
            // Get delete index
            const deleteIndex = playlist.albums
                .map(album => album.id)
                .indexOf(req.params.album_id);

            if (deleteIndex === -1) {
                res.status(404).json({
                    noalbumfound: 'Album not found in playlist'
                });
                return;
            }

            // Splice out of array
            playlist.albums.splice(deleteIndex, 1);

            playlist.save().then(playlist => res.json(playlist));
        })
        .catch(err =>
            res.status(404).json({ noplaylistfound: 'No playlist found' })
        );
});

module.exports = router;
