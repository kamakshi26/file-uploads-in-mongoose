require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path=require("path");
const mongoose=require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
mongoose.connect("mongodb+srv://admin-kamakshi:Kamakshi@00@cluster0-n08gz.mongodb.net/uploadimageDB",{useNewUrlParser: true});
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const imageSchema=mongoose.Schema({
  imageURL:String,
  imageid : String
});

const Image=mongoose.model("Image",imageSchema);
cloudinary.config({
cloud_name: process.env.CLOUD_NAME,
api_key: process.env.API_KEY,
api_secret: process.env.API_SECRET
});
const storage = cloudinaryStorage({
cloudinary: cloudinary,
folder: "demo",
allowedFormats: ["jpg", "png"],
transformation: [{ width: 200, height: 200, crop: "limit" }]
});
const parser = multer({ storage: storage });
app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/pic.html')
});
app.post('/api/images', parser.single("image"), (req, res) => {
  console.log(req.file) // to see what is returned to you
  const image = new Image(
    {
      imageURL : req.file.url,
      imageid : req.file.public_id
    }
  );
image.save(function(err)
{
  res.redirect('/latestproducts');
});
app.get('/latestproducts',function(req,res)
{
  Image.find({},function(err,founditems)
{ console.log(founditems);
  if(!err)
  {
    res.render('latest',{printcontent:founditems} );
  }
});
});

});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
