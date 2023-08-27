const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    
    name : {
        type : String,
        required : true,
        minlength : 3,

    },

    email : {

        type : String,
        trim : true,
        lowercase : true,
        unique : true,
        required : true,
    },

    password : {

        type : String,
        required : true,
        minlength : 8,

    },
    contactNo : {

        type : String,
        maxlength : 10,
        minlength : 10,
        required : true,

    },
    userVerified : {
        
        type : Boolean,
        default: true,
        required : true,

    },
    mode : {
        type : String,
        default : "email",
        required : true,
    },

    Cart : [],

    modeVerified: {
        type : Boolean,
        default : true,
    }

});

userSchema.methods.generateHash = (password) =>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

const User = mongoose.model('User', userSchema);
module.exports = User;