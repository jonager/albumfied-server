const express = require('express');
const router = express.Router();
const passport = require('passport');

const axios = require('axios');

const authCheck = require('../../utils/helpers').authCheck;

// @route GET api/spotify/new-releases
// @description  Get new releases
// @acces Private
router.get('/new-releases', authCheck, (req, res) => {
    axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/browse/new-releases',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + req.user.accessToken
        },
        params: {
            country: 'US',
            limit: 50
        }
    })
        .then(response => {
            res.json(response.data);
        })
        .catch(error => {
            res.json(error);
        });
});

// @route GET api/spotify/search/:search_query
// @description  Get results for album, artist search
// @acces Private
router.get('/search/:search_query', authCheck, (req, res) => {
    axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/search',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + req.user.accessToken
        },
        params: {
            q: req.params.search_query,
            type: 'album,artist',
            market: 'US'
        }
    })
        .then(response => {
            if (
                response.data.albums.items.length === 0 ||
                response.data.artists.items.length === 0
            ) {
                res.status(404).json({
                    nofound: 'Album/Artist not found'
                });
                return;
            }
            res.json(response.data);
        })
        .catch(error => {
            res.json(error);
        });
});

// @route GET api/spotify/artists/:artist_id
// @description  Get spotify catalog information for an artist by id
// @access Private
router.get('/artists/:artist_id', authCheck, (req, res) => {
    axios({
        method: 'get',
        url: `https://api.spotify.com/v1/artists/${req.params.artist_id}`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + req.user.accessToken
        }
    })
        .then(response => {
            res.json(response.data);
        })
        .catch(error => {
            res.json(error);
        });
});

// @route GET api/spotify/artists/:artist_id/albums
// @description  Get spotify catalog information about an artist’s albums
// @access Private
router.get('/artists/:artist_id/albums', authCheck, (req, res) => {
    axios({
        method: 'get',
        url: `https://api.spotify.com/v1/artists/${
            req.params.artist_id
        }/albums`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + req.user.accessToken
        },
        params: {
            include_groups: 'album',
            market: 'US',
            limit: 50,
            offset: 0
        }
    })
        .then(response => {
            res.json(response.data);
        })
        .catch(error => {
            res.json(error);
        });
});

// @route GET api/spotify/artists/:artist_id/related-artists
// @description  Get spotify catalog information about artists similar to a given artist
// @acces Private
router.get('/artists/:artist_id/related-artists', authCheck, (req, res) => {
    axios({
        method: 'get',
        url: `https://api.spotify.com/v1/artists/${
            req.params.artist_id
        }/related-artists`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + req.user.accessToken
        }
    })
        .then(response => {
            res.json(response.data);
        })
        .catch(error => {
            res.json(error);
        });
});

// @route GET api/spotify/albums/:offset
// @description  Get a list of the albums saved in the current Spotify user’s ‘Your Music’ library.
// @acces Private
router.get('/albums/:offset', authCheck, (req, res) => {
    axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/me/albums',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + req.user.accessToken
        },
        params: {
            market: 'US',
            limit: 50,
            offset: req.params.offset
        }
    })
        .then(response => {
            res.json(response.data);
        })
        .catch(error => {
            res.json(error);
        });
});

// @route GET api/spotify/albums/:album_id
// @description  Get spotify catalog information for a single album.
// @acces Private
router.get('/album/:album_id', authCheck, (req, res) => {
    axios({
        method: 'get',
        url: `https://api.spotify.com/v1/albums/${req.params.album_id}`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + req.user.accessToken
        },
        params: {
            market: 'US'
        }
    })
        .then(response => {
            res.json(response.data);
        })
        .catch(error => {
            res.status(404).json({ err: 'Album not found    ' });
        });
});

// @route DELETE api/spotify/albums/:album_id
// @description  Remove one or more albums from the current user’s library.
// @access Private
router.delete('/albums/:album_id', authCheck, (req, res) => {
    axios({
        method: 'delete',
        url: `https://api.spotify.com/v1/me/albums`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + req.user.accessToken
        },
        params: {
            ids: req.params.album_id
        }
    })
        .then(response => {
            res.json(response);
        })
        .catch(error => res.json(error));
});

// @route GET api/spotify/albums/contains
// @description  Check if album is already saved in the current user’s ‘Your Music’ library.
// @access Private
router.get('/albums/contains/:album_id', authCheck, (req, res) => {
    axios({
        method: 'get',
        url: `https://api.spotify.com/v1/me/albums/contains`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + req.user.accessToken
        },
        params: {
            ids: req.params.album_id
        }
    })
        .then(response => {
            res.json(response.data);
        })
        .catch(error => res.json(error));
});

// @route GET api/spotify/albums/save/:album_id
// @description  Check if album is already saved in the current user’s ‘Your Music’ library.
// @access Private
router.put('/albums/save/:album_id', authCheck, (req, res) => {
    console.log('runs');
    axios({
        method: 'PUT',
        url: 'https://api.spotify.com/v1/me/albums',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + req.user.accessToken
        },
        params: {
            ids: req.params.album_id
        }
    })
        .then(response => {
            res.json(response);
        })
        .catch(error => res.json(error));
});

module.exports = router;
