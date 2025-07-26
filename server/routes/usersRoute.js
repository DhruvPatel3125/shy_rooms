const express = require("express");
const router = express.Router();
const User = require("../models/user")
router.post("/register",async(req,res)=>{
    const newUser = new User({name:req.body.name,email:req.body.email,password:req.body.password})
    try {
        const user = await newUser.save()
        res.send("User registered SuccessFully")
    } catch (error) {
        return res.status(400).json({error})
    }
})

router.post("/login",async(req,res)=>{
    const {email,password} = req.body
   try {
    const user =await User.findOne({email:email,password:password})
    if(user){
        const tempUser = {  
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            _id:user._id
        }
    res.send(tempUser)
    }
    else{
        return res.status(400).json({message:'login failed'})
    }
   } catch (error) {
    return res.status(400).json({error})
   }
})
module.exports = router