const router=require('express').Router();
const vote=require('../controllers/vote');

router.post('/viewSug',vote.sugView);
//router.post('/castVote',vote.castingVote);
router.post('/castVote',vote.castingVoteTest);

module.exports=router;