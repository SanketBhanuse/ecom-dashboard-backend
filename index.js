const express = require('express');
const cors = require('cors');
require('./DB/config');
const user = require('./DB/users');
const Product = require('./DB/product');
const Jwt = require('jsonwebtoken');
const Jwtkey = "ecom" ;
const app = express();
app.use(express.json());
app.use(cors());

app.post('/signup',async (req,res)=>{
   const data = new user(req.body);
   let result = await data.save();
   result = result.toObject();
   delete result.password
   Jwt.sign({result},Jwtkey,(err,token)=>{
      if(err){

         res.send({result:"Something went wrong , please try again later"});
      }
         res.send({result, auth:token})
   }) 
})

app.post('/login', async(req,res)=>{
   if(req.body.email && req.body.password){
      const result = await user.findOne(req.body).select("-password");
      if(result){
         Jwt.sign({result},Jwtkey,(err,token)=>{
            if(err){

               res.send({result:"Something went wrong , please try again later"});
            }
               res.send({result, auth:token})
         }) 

      }else{
         res.send({result:"user not found"});
      }
   }else{
      res.send({result:"user not found"});
   }
})


app.post('/add-product',verifyToken, async (req,res)=>{
   let product = new Product(req.body);
   let result = await product.save();
   res.send(result);
})


app.get('/products',verifyToken,async (req,res)=>{
   let products = await Product.find();
   if(products.length > 0){
      res.send(products);
   } else{
      res.send({result:"Product Not Found"})
   }
})

app.delete('/delete/:id',verifyToken,async(req,res)=>{
   let result = await Product.deleteOne({_id:req.params.id});
   res.send(result)
})

app.get('/product/:id',verifyToken, async(req,res)=>{
   let result =await Product.findOne({_id:req.params.id});
   if(result){
      res.send(result);
   }else{
      res.send({result:"something wrong"})
   }
})

app.put('/product/:id',verifyToken,async(req,res)=>{
   let result = await Product.updateOne({_id:req.params.id},
      {
         $set:req.body
      }
   )

   res.send(result);
})

app.get('/search/:key',verifyToken,async (req,res)=>{
   let result = await Product.find({
      $or:[
         {name:{$regex:req.params.key}},
         {company:{$regex:req.params.key}},
         {category:{$regex:req.params.key}}
      ]
   });
   res.send(result);
})


function verifyToken(req,res,next){
   let token = req.headers['authorization'];
   if(token){
      token = token.split(' ')[1];
      console.log(token);
      Jwt.verify(token,Jwtkey,(err,valid)=>{
         if(err){
      res.send({result:"Please provide valid token"})
            
         }else{
            next();

         }
      })
   }else{
      res.status(401).send({result:"Please add token with header"})
   }
}
app.listen(5000);