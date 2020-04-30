const router=require('express').Router();
const sug=require('../controllers/sug');

router.post('/registerSug',sug.sugRegister);

module.exports=router;