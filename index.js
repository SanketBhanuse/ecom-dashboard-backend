const express = require('express');
const cors = require('cors');
require('./DB/config');
const product = require('./DB/users');
const app = express();
app.use(express.json());
app.use(cors());

app.post('/signup',async (req,res)=>{
   const data = new product(req.body);
   const result = await data.save();
   res.send(result);
})
app.listen(5000);