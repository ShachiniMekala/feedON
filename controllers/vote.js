const Sug = require('../models/suggestion');

exports.sugView = async (req, res) => {
    try {
        Sug.find({ status: true, code: req.body.code }, {}).then(allSug => {
            console.log('helooooooooooooooooo'+allSug);
           if(allSug==''){
            res.status(401).send('Suggestion not found');
           }
           else{
            res.status(200).send(allSug);
           }
        });
    } catch (err) {
        res.status(400).send(err);
    }

}

exports.castingVote = (req, res) => {

    try {
        var votedSug = '';
        Sug.findOne({ _id: req.body.id}).then(voted => {
            votedSug = voted;
            if (votedSug.status == true) {
                for (var i = 0; i < votedSug.option.length; i++) {
                    if (req.body.selectedOption == votedSug.option[i]._id) {
                        votedSug.option[i].count++;
                        votedSug.total++;
                        try {
                            Sug.update({ _id: req.body.id, "option._id": req.body.selectedOption }, { $set: { 'option.$.count': votedSug.option[i].count } }).then(result1 => {
                                console.log(result1);
                                Sug.update({ _id: req.body.id }, { $set: { "total": votedSug.total } }).then(result2 => {
                                    console.log(result2);
                                });

                            });
                            break;
                        } catch (error) {
                            res.status(402).send(error);
                        }
                    }
                }
                if (req.body.comment!='') {
                    // console.log('ccccccccccccccccccccccccccccccccccccccccccccc'+req.body.comment);
                    Sug.update({ _id: req.body.id }, { $push: { comments: req.body.comment } }).then(res3 => {
                        //  console.log('3333333333333333333333333333333333'+res3);
                    }).catch(err => {
                        res.status(403).send(err);
                    });
                }
                res.status(405).send('Session Already Closed');
            }
            else {
                res.status(200).send('Sucessfully Updated');
            }

        }).catch(err => {
            res.status(401).send(err);
        });


    } catch (error) {
        res.status(400).send(error);
    }

}