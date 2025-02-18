const express = require('express') 
const connect_DB = require("./config/db")
const User = require("./models/user");  
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const cookieParser = require('cookie-parser');



const app = express() 
app.use(express.json())

app.use(cookieParser())



app.post('/signup', async (req,res) =>{
    const {firstName, lastName, emailID, password,age,bio,location,skills,photoUrl,gender} = req.body
    try{
        if(emailID){
            const user = await User.findOne({emailID : emailID})
            if(user) return res.status(400).json({message: 'User already exists with this email'})
        } else if(firstName || lastName || password|| emailID){
            return res.status(400).json({message: 'Please provide all the required fields'})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            firstName, lastName, emailID, password : hashedPassword,age,bio,location,skills,
            photoUrl, gender
        })
        await newUser.save()
        res.status(201).json({message: 'User created successfully'})


       
        
    }
    catch(err){
        res.json({message: err.message})
    }

})  



app.post('/login', async(req,res) =>{
    const {emailID,password} = req.body
    try{
        const user = await User.findOne({emailID : emailID}) 
        if(!user) return res.status(400).json({message: 'User not found'})
        const validPassword = await bcrypt.compare(password,user.password); 
    
        if(!validPassword) return res.status(400).json({message: 'Invalid password'})
            const token = jwt.sign({_id : user._id}, "Shyam@123", {expiresIn: '1h'}) 
        res.cookie("token", token) ; 
        res.json({message: 'Logged in successfully'})



    }catch{
        res.json({message: err.message})


    }
},) 

app.get('/profile',async (req,res) =>{
    const {token} = req.cookies
    if(!token) return res.status(401).json({message: 'Unauthorized'})
        try{
            const payload = jwt.verify(token, "Shyam@123")
            const user = await User.findOne({_id: payload._id})
            if(!user) return res.status(400).json({message: 'User not found'})
            res.status(200).json(user)

        }
            catch(err){
                res.json({message: err.message})
            }
})

app.get('/user', async(req,res) =>{ 
    const emailID = req.body.emailID  
    try{
        const user = await User.findOne({emailID : emailID})
        if(!user) return res.status(400).json({message: 'User not found'})
        res.json(user)

       
    }catch(err){
        res.json({message: err.message})
    }
   

}) 

app.patch('/user', async(req,res) =>{
    const userId = req.body.useId 
    const data = req.body 
    try{
        const user = await User.findByIdAndUpdate({_id : userId}, data)
        res.json({user: user})



    }catch(error){
        res.json({message: error.message})
    }
})

app.get('/feed', async (req,res) =>{
    const users = await User.find({})
    res.json(users)
})

connect_DB()
  .then(() => {
    console.log("MongoDB Connected"); 

    app.listen(7777,()=>{
        console.log('Server is running on port 7777')
    })
  })

  .catch((err) => console.error(err));


