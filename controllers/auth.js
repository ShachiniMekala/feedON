const User=require('../models/user');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

//validation

var emailRegex=/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
exports.signUp=async(req,res)=>{

//console.log('Registering');
const emailExists= await User.findOne({email:req.body.email});
if(!(emailRegex.test(req.body.email)))return res.status(400).send('Invalid Email');
if(emailExists) return res.status(400).send('User already Exists');
const salt=await bcrypt.genSalt(10);
const hashedPasword=await bcrypt.hash(req.body.password,salt);


const user=new User({
    name:req.body.name,
    email:req.body.email,
    password:hashedPasword
});

try{
    console.log('Registering');
    const savedUser=await user.save();
    console.log('Registered');
    res.send(savedUser);
}catch(err){
    res.status(400).send(err);
}
}

exports.userLogin=async(req,res)=>{
    //user validation
    const userExists= await User.findOne({email:req.body.email});
    if(!userExists) return res.status(400).send('User does not exists');

    //password validation
    const pwdvalid=await bcrypt.compare(req.body.password,userExists.password);
    if(!pwdvalid) return res.status(400).send('Invalid Password');

    const token=jwt.sign({_id:userExists._id,name:userExists.name,email:userExists.email},process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);

}