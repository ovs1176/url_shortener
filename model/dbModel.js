const mongoose=require('mongoose');


const shortenSchema=new mongoose.Schema({
    fullUrl:{
        type:String,
        required:true,
        unique:[true, "This URL already exists!"]
    },
    shortUrl:{
        type:String,
        required:true
    }
    
})

module.exports=mongoose.model('shortenUrl',shortenSchema);