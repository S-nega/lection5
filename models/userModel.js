const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        name: {
            type: String, 
            required: [true, "Please enter user name"]
        },
        email: {
            type: String,
            isEmail: { errorMessage: "Please provide valid email" },
            required: [true, "Please enter user email"]
        },
        password: {
            type: String,
            required: true,  
        },
        file: {
            data: Buffer,
            contentType: String,
          }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema);

module.exports = User;