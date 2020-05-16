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
    // console.log(req["id"]);
    // console.log(req["selectedOption"]);
    // console.log(req["comment"]);
    try {
        //console.log(req.body.id);
        var sugID=req["id"];
        var option_ID=req["selectedOption"];
        var comment=req["comment"];
        Sug.findOne({ _id:sugID }).then(votedSug => {
            if (votedSug.status == true) {
                if (!!option_ID && !comment) {  //option has no comment
                    for (var i = 0; i < votedSug.option.length; i++) {
                        if (option_ID == votedSug.option[i]._id) {
                            // votedSug.option[i].count++;
                            // votedSug.total++;
                            try {
                                Sug.updateOne({ _id: sugID, "option._id": option_ID }, { $inc: { 'option.$.count':1} }).then(result1 => {
                                    Sug.findOneAndUpdate({ _id: sugID }, { $inc: { "total": 1 } }).then(result2 => {
                                        //console.log(result2);
                                        return res(result2);
                                    });

                                });
                            } catch (error) {
                                //console.log(error);
                                return res(false);
                                
                            }
                        }
                    }
                }
                // else if (!option_ID && !!comment) {//has comment no option
                //     Sug.updateOne({ _id: sugID }, { $push: { comments: comment } }).then(res3 => {
                //         //console.log(res3);
                //         return res(res3);
                //     }).catch(err => {
                //         // console.log(err);
                //         return res(false);
                        
                //     });
                // }
                else {//has comment and option
                    for (var i = 0; i < votedSug.option.length; i++) {
                        if (option_ID == votedSug.option[i]._id) {
                            // votedSug.option[i].count++;
                            // votedSug.total++;
                            try {
                                Sug.updateOne({ _id: sugID, "option._id": option_ID },{$inc: {'option.$.count': 1}}).then(result1 => {
                                    Sug.updateOne({ _id: sugID }, { $inc: { "total": 1 } }).then(result2 => {

                                        Sug.findOneAndUpdate({ _id: sugID }, { $push: { comments: comment } }).then(res3 => {
                                            // console.log(res3)
                                            return res(res3);
                                        }).catch(err => {
                                            // console.log(err);
                                            return res(false);
                                           
                                        });


                                    });

                                });
            
                            } catch (error) {
                                //console.log(error);
                                return res(false);
                               
                            }
                        }
                    }

                }

            }
            else {
                // console.log('Unknown else');
                return res(false);
        

            }

        }).catch(err => {
            // console.log(err);
            return res(false);
        });


    } catch (error) {
        // console.log(error);
        return res(false);
        
    }

}



//testing for trigger
exports.castingVoteTest = async (req, res) => {
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
                            //votedSug.option[i].count++;
                            try {
                                Sug.findOneAndUpdate({ _id: sugID, "option._id": option_ID }, { $inc: { 'option.$.count': 1 } }).then(result1 => {
                                   return res.send(result1);
                                });
                            } catch (error) {
                                //console.log(error);
                                return res.send(error);
                                
                            }
                        }
                    }
                }
                else {//has comment and option
                    for (var i = 0; i < votedSug.option.length; i++) {
                        if (option_ID == votedSug.option[i]._id) {
                            //votedSug.option[i].count++;
                            try {
                                Sug.updateOne({ _id: sugID, "option._id": option_ID }, { $inc: { 'option.$.count': 1} }).then(result1 => {
                                        Sug.findOneAndUpdate({ _id: sugID }, { $push: { comments: comment } }).then(res3 => {
                                            // console.log(res3)
                                            return res.send(res3);
                                        }).catch(err => {
                                            // console.log(err);
                                            return res.send(err);
                                           
                                        });

                                });
            
                            } catch (error) {
                                //console.log(error);
                                return res.send(error);
                               
                            }
                        }
                    }

                }

            }
            else {
                console.log('Unknown else');
               // return res.send('Unknown');
        

            }

        }).catch(err => {
            // console.log(err);
            return res.send(err);
        });


    } catch (error) {
        // console.log(error);
        return res.send(error);
        
    }

}