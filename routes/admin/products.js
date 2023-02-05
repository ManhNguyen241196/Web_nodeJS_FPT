const express = require('express');

const {check, validationResult} = require('express-validator'); // goi module express-validator nhung chi lay kết quả từ 
//giao thức. Giao thức sẽ được thực hiện với check nhưng sẽ k load trược tiếp mà 
//load thông qua biến trung gian. 

const test = require('./validators')

const productsRepo = require('../../respositories/products');
const productNewTemplate = require('../../views/admin/products/new')


const router = express.Router();

router.get('/admin/products',(req,res)=>{
  res.send("hello admin products")
})


//hien thi form len gai dien web 
router.get('/admin/products/new',(req,res)=>{
    res.send(productNewTemplate({}))
  })
  

// gui data tu form len server 
router.post('/admin/products/new',
  [
     test.requireTitle,
     test.requirePrice
  ]
,
async (req,res)=>{ // đăng kí tài khoản
  const errors = validationResult(req)
  console.log(errors.mapped())
  
  console.log('data gui len server la: ', req.body)
  
  res.send('submitted')
  
}
),

module.exports = router;