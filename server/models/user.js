const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Please add an email"],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please add a valid email",
            ],
            unique: true
        },
        password: {
            type: String,
            // required: [true, "Please add a password"],
            minlength: [6, "Password minimum length is 6 characters"],
        },
        firstName: String,
        lastName: String,
        phone: {
            type: String,
            // required: true
        },
        imagePath: {
            type: String,
        },
        role: {
            type: String,
            default: 'user',
            enum: ['user', 'admin', 'super']
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Entity'
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        }
    }
);

// assign jwt
UserSchema.methods.getSignedJwToken = function () {
    const token = jwt.sign({
        id: this._id,
    },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE,
        });
    return { token };
};

// Match input password with encrypted password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

let Users = mongoose.model("User", UserSchema);
module.exports = Users;