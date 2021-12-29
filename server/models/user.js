const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'vui long nhap ten'],
        maxLength: [50, 'ten khong qua 50 ki tu']
    },
    email: {
        type: String,
        required: [true, 'vui long nhap email'],
        unique: true,
        validate: [validator.isEmail, 'vui long nhap dung dia chi mail']
    },
    password: {
        type: String,
        required: [true, 'vui long nhap password'],
        minLength: [6, 'password phai tren 6 ki tu'],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

})
//encryting password before saving user
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})
//compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

//return JWT token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}
//gennerate password reset token
userSchema.methods.getResetPasswordToken = function () {
    //generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    //hash and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    //set tokne expire time
    this.resetPasswordExpire = Date.now() + 30*60*1000
    return resetToken
}

module.exports = mongoose.model('User', userSchema);
