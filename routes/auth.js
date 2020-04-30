const router=require('express').Router();
const auth=require('../controllers/auth');

router.post('/signUp',auth.signUp);
router.post('/userLogin',auth.userLogin);


module.exports=router;