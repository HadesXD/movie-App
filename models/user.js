const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(     // A basic user Schema to be stored in the 'users' collection in my-db.
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        favorites: [{
            type: String
        }],
        picture: { type: String, default: '' },
        description: { type: String, default: ''}
    },
    {   versionKey: false,
        collection: 'users' }
);

const User = mongoose.model('User', userSchema);

module.exports = User;