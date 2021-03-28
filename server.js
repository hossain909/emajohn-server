const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.awgwi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000

 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const allProducts = client.db("simple-e-commerce").collection("products");
  const ordersCollection = client.db("simple-e-commerce").collection("orders");
  console.log("Connected Successfully!");
  
  app.post("/addProduct", (req,res)=>{
    const products = req.body;
    console.log(products);
    allProducts.insertOne(products)
    .then(result => {
      console.log(result.insertedCount);
      res.send(result.insertedCount)
    })
  })
  app.get("/products",(req,res)=>{
    allProducts.find({})
    .toArray((err,docs)=>{
      res.send(docs)
    })
  })
  app.get("/product/:key", (req, res)=>{
    allProducts.find({key: req.params.key})
    .toArray((err,docs)=>{
      res.send(docs)
    })
  })
  app.post("/productsByKeys", (req,res) =>{
    const productKeys = req.body;
    allProducts.find({key: {$in: productKeys}})
    .toArray((req, docs)=>{
      res.send(docs)
    })
  })

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

});


app.listen(process.env.PORT || port)