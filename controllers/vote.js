const Sug = require('../models/suggestion');

exports.sugView = async (req, res) => {
    try {
    
        Sug.findOne({code: req.body.code }).then(allSug => {
            //console.log('helooooooooooooooooo' + allSug.status);
            
            if(allSug.status==false) return res.status(402).send('Session Already Closed');
            
            return res.status(200).send(allSug);
        }).catch(err=>{
            return res.status(403).send('Suggestion not found');
        });
    } catch (err) {
        return res.status(400).send(err);
    }
}

exports.castingVote = (req, res) => {
    console.log(req.body.id);
    console.log(req.body.selectedOption);
    console.log(req.body.comment);
    try {
        //console.log(req.body.id);
        var sugID=req.body.id;
        var option_ID=req.body.selectedOption;
        var comment=req.body.comment;
        Sug.findOne({ _id:sugID }).then(votedSug => {
            if (votedSug.status == true) {
                if (!!option_ID && !comment) {  //option has no comment
                    for (var i = 0; i < votedSug.option.length; i++) {
                        if (option_ID == votedSug.option[i]._id) {
                            votedSug.option[i].count++;
                            votedSug.total++;
                            try {
                                Sug.updateOne({ _id: sugID, "option._id": option_ID }, { $set: { 'option.$.count': votedSug.option[i].count } }).then(result1 => {
                                    Sug.updateOne({ _id: sugID }, { $set: { "total": votedSug.total } }).then(result2 => {
                                        return res.status(200).send(result2);
                                    });

                                });
                            } catch (error) {
                                res(false);
                                return;
                            }
                        }
                    }
                }
                else if (!option_ID && !!comment) {//has comment no option
                    Sug.updateOne({ _id: sugID }, { $push: { comments: comment } }).then(res3 => {
                        return res.status(200).send(res3);
                    }).catch(err => {
                        res(false);
                        return;
                    });
                }
                else {//has comment and option
                    for (var i = 0; i < votedSug.option.length; i++) {
                        if (option_ID == votedSug.option[i]._id) {
                            votedSug.option[i].count++;
                            votedSug.total++;
                            try {
                                Sug.updateOne({ _id: sugID, "option._id": option_ID }, { $set: { 'option.$.count': votedSug.option[i].count } }).then(result1 => {
                                    Sug.updateOne({ _id: sugID }, { $set: { "total": votedSug.total } }).then(result2 => {

                                        Sug.updateOne({ _id: sugID }, { $push: { comments: comment } }).then(res3 => {
                                            return res.status(200).send(res3);
                                        }).catch(err => {
                                            res(false);
                                            return;
                                        });


                                    });

                                });
            
                            } catch (error) {
                                res(false);
                                return;
                            }
                        }
                    }

                }

            }
            else {
                res(false);
                return;

            }

        }).catch(err => {
            res(false);
            return;
        });


    } catch (error) {
        console.log(error);
        res(false);
        return;
    }

}