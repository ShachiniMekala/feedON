const Sug = require('../models/suggestion');
const generator = require('generate-password');

exports.sugRegister = async (req, res) => {
    var optionName = [];
    //var comments=[];
    for (var i = 0; i < req.body.option.length; i++) {
        optionName.push({ name: req.body.option[i], count: 0 });
    }
        //comments.push({ name: null, comment:null});
    const sug = new Sug({
        user_id: req.body.user_id,
        suggestion: req.body.suggestion,
        status: true,
        code: generator.generate({
            length: 5,
            numbers: true,
            lowercase:true,
            uppercase:true
        }),
        option: optionName,
        total: 0,
        //comments:comments
    });

    try {
        console.log(optionName);
        const savedSug = await sug.save();
        console.log('Registered');
        res.status(200).send(savedSug);
    } catch (err) {
        res.status(401).send(err);
    }
}

exports.sugClose = (req, res) => {

    Sug.updateOne({ _id: req.body.id }, { $set: { 'status': false } }).then(result => {
        Sug.countDocuments({ user_id: req.body.user_id, status: false }).then(records => {
            //console.log(`${records}`+' documents match the specified query.');
            if (records > 5) {
                //console.log(records);
                //console.log("limit reacheddddddddddd");
                //Sug.deleteOne({query :{user_id: req.body.user_id, status: false}, sort: {"date" :1}})
                Sug.findOneAndDelete({ user_id: req.body.user_id, status: false }, { sort: { "date": 1 } }).then(ok => {
                    //console.log(ok);
                    res.status(200).send('successfully updated');
                }).catch(err => {
                    res.status(401).send(err);
                });;

            }
            else {
                res.status(200).send('successfully updated');
            }
        }).catch(err => {
            res.status(401).send(err);//count error
        });
    }).catch(err => {
        res.status(401).send(err);
    });

}

exports.loadHistory = async (req, res) => {
    Sug.find({ user_id: req.body.user_id, status: false }).sort({ 'date': -1 }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(401).send('Previous records not found');
    });
}

exports.activeSug=async (req,res)=>{
    Sug.find({ user_id: req.body.user_id, status: true }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(401).send('No active suggestions found');
    });
}

exports.sugDelete = async (req, res) => {
    Sug.findOneAndDelete({ _id: req.body.sug_id}).then(ok => {
        console.log(ok);
        res.status(200).send('Sucessfully Deleted');
    }).catch(err => {
        console.log(err);
        res.status(401).send(err); 
    });;
}


