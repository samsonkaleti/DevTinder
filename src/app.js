const express = require('express') 
const connect_DB = require("./config/db")
const User = require("./models/user"); 


const app = express() 
app.use(express.json())



app.post('/signup', async (req,res) =>{
    const user = await new User(req.body)
    try{
        await user.save()
        res.status(200)
        res.json({message: 'User registered successfully'})
        
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


