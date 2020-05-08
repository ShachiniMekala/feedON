const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const generator = require('generate-password');

//validation

var emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
exports.signUp = async (req, res) => {

    //console.log('Registering');
    const emailExists = await User.findOne({ email: req.body.email });
    if (!(emailRegex.test(req.body.email))) return res.status(400).send('Invalid Email');
    if (emailExists) return res.status(400).send('User already Exists');
    const salt = await bcrypt.genSalt(10);
    const hashedPasword = await bcrypt.hash(req.body.password, salt);


    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPasword
    });

    try {
        console.log('Registering');
        const savedUser = await user.save();
        console.log('Registered');
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
}

exports.userLogin = async (req, res) => {
    //user validation
    const userExists = await User.findOne({ email: req.body.email });
    if (!userExists) return res.status(400).send('User does not exists');

    //password validation
    const pwdvalid = await bcrypt.compare(req.body.password, userExists.password);
    if (!pwdvalid) return res.status(400).send('Invalid Password');

    const token = jwt.sign({ _id: userExists._id, name: userExists.name, email: userExists.email }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

}

exports.forgotPassword = async (req, res) => {
    //const userExists= await User.findOne({email:req.body.email});
    //if(!userExists) return res.status(400).send('Incorrect Email');
    /*let transporter=nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
            user:process.env.EMAIL,
            pass:process.env.PWD
        }
        
    });
    //console.log(process.env.EMAIL);
    
    let mailOption={
        from:process.env.EMAIL,
        to: "shachinikarunarathne2016@gmail.com",
        subject: "Password Reset",
    }
    
    let info=await transporter.sendMail(mailOption);
    res.status(200).send(info);*/

    const userExists = await User.findOne({ email: req.body.email });
    if (!userExists) return res.status(400).send('Invalid Email');

    var password = generator.generate({
        length: 6,
        numbers: true,
        lowercase: true,
        uppercase: true
    })
    const salt = await bcrypt.genSalt(10);
    var OTP = await bcrypt.hash(password, salt);
    var expiresIn = Date.now() + 1800000;


    let transporter = nodemailer.createTransport({
        service: 'gmail', // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.PWD // generated ethereal password
        }
    });

    console.log(password);

    // send mail with defined transport object
    let mailOption = {
        from: process.env.EMAIL, // sender address
        to: userExists.email, // list of receivers
        subject: "feedON Password Reset", // Subject line
        text: "Hello Email",
        html: `<body>
    <div>
        <h3>Hello ${userExists.name},</h3>
        <p>You requested for an one time password, kindly use the following OTP :<br> <h2 style="text-align:center">${password}</h2></p>
        <br>
        <p>Cheers!</p>
    </div>
   
</body>`
    };

    transporter.sendMail(mailOption, function (err, data) {
        if (err) return res.status(400).send(err);

        // console.log('Email Sent');
        User.updateOne({ email: req.body.email }, { $set: { 'OTP': OTP, 'expiresIn': expiresIn } }).then(res => {
            console.log('User updated');
        }).catch(err => {
            console.log(err);
        });
        return res.status(200).send('Email sent! Check your email');


    });

}

exports.OTPLogin = async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email });

    if (!userExists) return res.status(400).send('Invalid Email');

    if ((await bcrypt.compare(req.body.otp, userExists.OTP)) && (userExists.expiresIn >= Date.now())) {
        // console.log('its ok');
        const token = jwt.sign({ _id: userExists._id, name: userExists.name, email: userExists.email }, process.env.TOKEN_SECRET);
        return res.header('auth-token', token).send(token);
    }
    return res.status(400).send('Timeout or incorrect password');

}

exports.editPassword = async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPasword = await bcrypt.hash(req.body.newPassword, salt);

    User.updateOne({ email: req.body.email }, { $set: { 'password': hashedPasword } }).then(result => {
        //console.log(result);
        return res.status(400).send('Sucessfuly updated');
    }).catch(err => {
        //console.log(err);
        return res.status(400).send(err);
    });
}