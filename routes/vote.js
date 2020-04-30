const router=require('express').Router();
const vote=require('../controllers/vote');

router.post('/viewSug',vote.sugView);
router.post('/castVote',vote.castingVote);

module.exports=router;