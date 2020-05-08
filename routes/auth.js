const router=require('express').Router();
const auth=require('../controllers/auth');
const verify=require('./verifyUser');

router.post('/signUp',auth.signUp);
router.post('/userLogin',auth.userLogin);
router.post('/otpLogin',auth.OTPLogin);
router.post('/forgotPassword',auth.forgotPassword);
router.post('/editPassword',verify,auth.editPassword);


module.exports=router;