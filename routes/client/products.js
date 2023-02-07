const express = require('express');

const router = express.Router();

router.get('/home/products', (req,res)=>{
    res.send("dkm co len");
});


module.exports = router;
