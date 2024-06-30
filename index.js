const express = require('express');
const app = express();

app.get('',(req,res)=>{
   res.send("backend run");
})
app.listen(5000);