const Sug = require('../models/suggestion');
const generator = require('generate-password');

exports.sugRegister = async (req, res) => {
    var optionName = [];
    for (var i = 0; i < req.body.option.length; i++) {
        optionName.push({ name: req.body.option[i], count: 0 });
    }
    const sug = new Sug({
        user_id: req.body.user_id,
        suggestion: req.body.suggestion,
        status: true,
        code: generator.generate({
            length: 5,
            numbers: true
        }),
        option: optionName,
        total: 0
    });

    try {
        console.log(optionName);
        const savedSug = await sug.save();
        console.log('Registered');
        res.send(savedSug);
    } catch (err) {
        res.status(400).send(err);
    }
}

exports.sugClose = async (req, res) => {

   Sug.update({ _id: req.body.id }, { $set: { 'status': false } }).then(result => {
        Sug.count({ user_id: req.body.user_id, status: false }).then(records =>{
            //console.log(`${records}`+' documents match the specified query.');
            if(records>5){
                console.log("limit reacheddddddddddd");
                //Sug.remove({query :{user_id: req.body.user_id, status: false}, sort: {"date" :1}, remove:true});
                res.status(200).send('successfully updated');
            }
          }
           
            ).catch(err => {
                console.error("Failed to count documents: ", err)
            });
            res.status(200).console.log('successfully updated');
        }).catch(err=>{
            res.status(400).send(err);
        });

}

exports.loadHistory = async (req, res) => {
    Sug.find({ user_id: req.body.user_id, status: false }).sort({ 'date': -1 }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(400).send('Previous records not found');
    });
}


