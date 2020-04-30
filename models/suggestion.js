const mongoose=require('mongoose');
const sugSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref:'User',
        required: true
    },
    suggestion:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    option:[{
        name:{
            type:String,
            required:true
        },
        count:{
            type :Number
        }    
    }],
    comments:[String],
    total:{
        type:Number,
        required:true
    },
    status:{
        type:Boolean,
        required:true
    },date:{
        type:Date,
        default:Date.now
    }
});


module.exports=mongoose.model('Suggestion',sugSchema);