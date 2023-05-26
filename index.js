const express = require("express")
const fu = require("express-fileupload");
var cors = require('cors')
var bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static("public"));
app.use(bodyParser.json())
app.use(express.json());
app.use(fu());



function initRoutes(){

 app.get("/",showAll);
 app.post("/test", insertTest)
 app.post("/addArticle", addArticle)




}

app.listen(5000,()=>{

 console.log("connected to port 5000")

})

const uri = process.env.mongo


const client = new MongoClient(uri, {

 serverApi: {

 version: ServerApiVersion.v1,

 strict: true,

 deprecationErrors: true,

 }

});

const db = client.db("HögskolanDB");

const col = db.collection("articles");

//console.log("collection", col);

run();

async function run() {

try {

 // Connect the client to the server (optional starting in v4.7)

 console.log("before connect");

 await client.connect();
 /* client.db("HögskolanDB").dropCollection("articles") */
 console.log("after connect");
initRoutes();

 }

 catch(err){

  console.log("connection", err.message);

 }

}

async function addArticle(req, res){

    let {img} = req.files;
     

    let {title,category,description,deepDescription, contact, favorite, orderForm,videos} = req.body;

    let imageName = img.name.split(".");
    let length = imageName.length;
    let url = "pictures/"+title+"."+imageName[(length-1)];
    req.files.img.mv("public/"+url);

    let article = {
        title:title,category:category,
        description:description,
        deepDescription:deepDescription, 
        contact:JSON.parse(contact), 
        favorite:JSON.parse(favorite),
        orderForm:JSON.parse(orderForm),
        videos:JSON.parse(videos), 
        url:url
    }
    
    const p = await col.insertOne(article)
    let result = await col.findOne({_id:p.insertedId})
    res.send(result);


}


async function insertTest(req,res){

   
    let { title, category, description} = req.body;
    console.log(title, category, description)
    let article = {title:title,category:category,description:description}
    
    const p = await col.insertOne(article)

    let result = await col.findOne({_id:p.insertedId})

    res.send(result);
} 



async function showAll(req,res){
    
    try{
        let result = await col.find().toArray();

        res.send(result);

    }
    catch(err){

        res.send(err);

    }
}