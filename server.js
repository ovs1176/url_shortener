const express=require("express");
const app=express();
const mongoose=require('mongoose');
require('dotenv').config();
app.use(express.static('public'));
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const urlModel=require("./model/dbModel");
const ShortUniqueId=require('short-unique-id');
const PORT=process.env.PORT || 3000;


mongoose.connect(process.env.URL,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log("Database Connected");
}).catch((err)=>{
    console.log(err);
})


app.get("/",async(req,res)=>{
    const allUrls=await urlModel.find();
    res.render("index",{urls:allUrls});
})

app.post("/submit",async(req,res)=>{

    const url=req.body.url.trim();

    const result=await urlModel.findOne({fullUrl:url});
    if(result){
        res.send("Url already exists!");

        // res.redirect("/");
    }
    else{
        const uid = new ShortUniqueId({ length: 6 });
    
        const short=new urlModel({
            fullUrl:url,
            shortUrl:uid()
        })
        await short.save();
        res.redirect("/");
    }

})

app.get("/:id",async(req,res)=>{
    const id=req.params.id;
    const result = await urlModel.findOne({shortUrl:id});
    if(!result){
        console.log("Site not found");
    }
    else{
        res.redirect(result.fullUrl);
    }
})

app.post("/delete/:id",async(req,res)=>{
    const id = req.params.id;
    urlModel.remove(({ shortUrl:id }), function (err) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Deleted");
            res.redirect("/");
        }
     });
})

app.listen(PORT,()=>{
    console.log("Server Running");
})