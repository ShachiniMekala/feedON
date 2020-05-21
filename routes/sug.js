const router=require('express').Router();
const sug=require('../controllers/sug');
const verify=require('./verifyUser');

router.post('/registerSug',verify,sug.sugRegister);
router.post('/closeSug',verify,sug.sugClose);
router.post('/loadHistory',verify,sug.loadHistory);
router.post('/activeSug',verify,sug.activeSug);
router.post('/deleteSug',verify,sug.sugDelete);

module.exports=router;