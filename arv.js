const express = require("express")
const fu = require("express-fileupload");
var cors = require('cors')
var bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static("pictures"));
app.use(bodyParser.json())
app.use(express.json());
app.use(fu());


function initRoutes(){
  app.get("/",showAll);
  app.post("/create", createArticle)
  app.post("/addImage", addImage)
  
}

app.listen(5000,()=>{
  console.log("connected to port 5000")
})


const uri = "mongodb+srv://arvidp:LeC3AfnpyosyB3p3@mymongo.ogqr2tg.mongodb.net/?retryWrites=true&w=majority"

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
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      initRoutes();

  }
  catch(err){
    console.log("connection", err);
  }
}

async function createArticle(req,res){

  let body = req.body;
  
  console.log(body)
  const p = await col.insertOne(body)
  let result = await col.findOne({_id:p.insertedId})
  //console.log(result)
  res.send(result)
}
async function addImage(req, res){

  let {img} = req.files;

  req.files.img.mv("pictures/"+img.name);

  console.log("files",req.files);
  console.log("body",req.body);

  res.send({test:true})
}


async function showAll(req,res){

  console.log(col);

  try{
    let result = await col.find().toArray();
    res.send(result);
  }
  catch(err){
    res.send(err);
  }

}