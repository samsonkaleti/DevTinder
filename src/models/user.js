const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type : String,
        required : true,
        minLength : 3,
        maxLength : 20, 

    }, 
    lastName:{
        type : String,
    } ,
    emailID :{
        type : String,
        required : true,
        lowercase : true,
        unique : true,

    }, 
    password:{
        type : String,
        required : true,
    }, 
    age :{
        type : Number,
        min : 18, 
        max : 100,
    
    }, 
    gender :{
        type : String,
        validate(value){
            if(!['male', 'female'].includes(value))
                throw new Error('Gender should be either male or female')
        }
       
    
    },
    photoUrl :{
        type : String,
        default : 'https://res.cloudinary.com/devtinder/image/upload/v1631856566/default_user_photo.png'
    },
    bio :{
        type : String,
        maxLength : 200,
    },
    location :{
        type : String,
       
    },
    skills :{
        type : [String],
       
    },

},{
    timestamps: true,
   
 
}) 

module.exports = mongoose.model('User',userSchema); 
