const express = require('express');
const cors = require('cors');
require('./DB/config');
const user = require('./DB/users');
const Product = require('./DB/product');
const app = express();
app.use(express.json());
app.use(cors());

app.post('/signup',async (req,res)=>{
   const data = new user(req.body);
   let result = await data.save();
   result = result.toObject();
   delete result.password
   res.send(result);
})

app.post('/login', async(req,res)=>{
   const result = await user.findOne(req.body).select("-password");
   if(req.body.email && req.body.password){
      if(result){
         res.send(result);
      }else{
         res.send({result:"user not found"});
      }
   }else{
      res.send({result:"user not found"});
   }
})


app.post('/add-product', async (req,res)=>{
   let product = new Product(req.body);
   let result = await product.save();
   res.send(result);
})


app.get('/products',async (req,res)=>{
   let products = await Product.find();
   if(products.length > 0){
      res.send(products);
   } else{
      res.send({result:"Product Not Found"})
   }
})

app.delete('/delete/:id',async(req,res)=>{
   let result = await Product.deleteOne({_id:req.params.id});
   res.send(result)
})

app.get('/product/:id', async(req,res)=>{
   let result =await Product.findOne({_id:req.params.id});
   if(result){
      res.send(result);
   }else{
      res.send({result:"something wrong"})
   }
})

app.put('/product/:id',async(req,res)=>{
   let result = await Product.updateOne({_id:req.params.id},
      {
         $set:req.body
      }
   )

   res.send(result);
})
app.listen(5000);