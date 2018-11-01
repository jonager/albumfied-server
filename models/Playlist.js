const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const PlaylistSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    name: {
        type: String,
        required: true
    },
    albums: [
        {
            albumId: {
                type: String,
                required: true
            },
            albumImgURI: {
                type: String,
                required: true
            },
            albumName: {
                type: String,
                required: true
            },
            artistId: {
                type: String,
                required: true
            },
            artistName: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Playlist = mongoose.model('playlists', PlaylistSchema);
