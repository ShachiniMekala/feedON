const Sug=require('../models/suggestion');
const generator = require('generate-password');

exports.sugRegister=async(req,res)=>{
    var optionName=[];
    for (var i = 0; i < req.body.option.length; i++) {
        optionName.push({name: req.body.option[i], count:0});
      }
    const sug=new Sug({
        user_id:req.body.user_id,
        suggestion:req.body.suggestion,
        status:true,
        code:generator.generate({
            length: 5,
            numbers: true
        }),
        option:optionName,
        total:0
    });

    try{
        console.log(optionName);
        const savedSug=await sug.save();
        console.log('Registered');
        res.send(savedSug);
    }catch(err){
        res.status(400).send(err);
    }
}


