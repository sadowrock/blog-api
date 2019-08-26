const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    username: {
        type: String, 
        required: true, 
        trim: true, 
        minlength: 2
    },
    password: {
        type: String, 
        required: true, 
        trim: true, 
        minlength: 6
    },
    email: {
        type: String,
        unique: true,
        required: true, 
        trim: true
    },
    created_at: {
        type: Date,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    }
});

 
module.exports = mongoose.model('user', UserSchema);