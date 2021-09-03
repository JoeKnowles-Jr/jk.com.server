const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

// User Schema
const UserSchema = mongoose.Schema({
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: true },
    needsPwUpdate: { type: Boolean, required: false },
    role: { type: String, required: false },
    viewedVideos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: false,
        default: []
    }],
    likedVideos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: false,
        default: []
    }],
    dislikedVideos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: false,
        default: []
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: false,
        default: []
    }]
}, { timestamps: true });

UserSchema.pre('save', function (next) {
    const user = this;

    bcrypt.hash(user.password, SALT_WORK_FACTOR, (err, hash) => {
        if (err) { return next(err); }

        user.password = hash;
        next();
    });

});

UserSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) { return callback(err); }

        callback(null, isMatch);
    });
};

UserSchema.methods.addViewedVideo = function (vid) {
    this.viewedVideos.push(vid);
    this.save();
}

UserSchema.methods.addLikedVideo = function (vid) {
    this.likedVideos.push(vid);
    this.save();
}

UserSchema.methods.removeLikedVideo = function (vid) {
    const idx = this.likedVideos.indexOf(vid);
    if (idx > -1) {
        this.likedVideos.splice(idx, 1);
    }
    this.save();
}

UserSchema.methods.addDislikedVideo = function (vid) {
    this.dislikedVideos.push(vid);
    this.save();
}

UserSchema.methods.removeDislikedVideo = function (vid) {
    const idx = this.dislikedVideos.indexOf(vid);
    if (idx > -1) {
        this.dislikedVideos.splice(idx, 1);
    }
    this.save();
}

UserSchema.methods.addComment = function (cid) {
    this.comments.push(cid);
    this.save();
}

UserSchema.methods.deleteComment = function (cid) {
    const idx = this.comments.indexOf(cid);
    if (idx > -1) {
        this.comments.splice(idx, 1);
    }
    this.save();
}

module.exports = mongoose.model('User', UserSchema);
