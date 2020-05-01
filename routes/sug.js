const router=require('express').Router();
const sug=require('../controllers/sug');

router.post('/registerSug',sug.sugRegister);
router.post('/closeSug',sug.sugClose);
router.post('/loadHistory',sug.loadHistory);

module.exports=router;