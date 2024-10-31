const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const User = require('./models/userModels')
const dotenv = require('dotenv')
dotenv.config();

const PORT = process.env.PORT || 3000;  // Use dynamic port for Vercel
const MONGO_URL = process.env.ATLAS_API_KEY;
// console.log( 'this is mogo url' ,MONGO_URL)

const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect(MONGO_URL)
.then(() =>{console.log("mongodb connect successfull")})
.catch((err) =>{console.log("mongodb connection error", err)})

app.get('/', (req, res) =>{
    res.send("this is home page")
})

app.get('/users', async(req, res) =>{
    try {
        const users = await User.find();
        res.status(200).json({message: 'fetching all users', data: users})
    } catch (error) {
        console.log('error in fatching users')
        res.status(500).json({message: 'error in fetching users'})
    }

})

// CREATE USERS 
app.post('/users', async(req, res) =>{
  const {name, email} = req.body;
    try {
        const newUser = new User({name, email})
        const saveUser = await newUser.save()
        res.status(200).json({message: 'create new users', data: saveUser})
    } catch (error) {
        console.log('error in create users')
        res.status(500).json({message: 'error in create users'})
    }

})
//UPDATE USERS
app.put('/users/:id', async(req, res) =>{
    try {
        const {name, email} = req.body;
        const updateUser = await User.findByIdAndUpdate(req.params.id,
            {name, email},
            {new: true}
        )
        if(!updateUser){
            res.status(404).json({message: '404 not found'})
        }
        res.status(200).json({message: 'update  users successfull', data: updateUser})
    } catch (error) {
        console.log('error in update users')
        res.status(500).json({message: 'error in update users'})
    }
})

//DELETE USERS
app.delete('/users/:id', async(req, res) =>{
    try {
        const deleteUser = await User.findByIdAndDelete(req.params.id)
        if(!deleteUser){
            res.status(404).json({message: '404 not found'})
        }
        res.status(200).json({message: `delete users with ID ${req.params.id} successfull`})
    } catch (error) {
        console.log('error in delete users')
        res.status(500).json({message: 'error in delete users'})
    }
})

app.listen(PORT, () =>{
    console.log(`server is listening on PORT http://localhost:${PORT}`)
})