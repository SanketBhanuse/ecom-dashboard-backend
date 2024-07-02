const express = require('express');
const cors = require('cors');
require('./DB/config');
const user = require('./DB/users');
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
app.listen(5000);