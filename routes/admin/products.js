const express = require('express');

// const {check, validationResult} = require('express-validator'); // goi module express-validator nhung chi lay kết quả từ 
// //giao thức. Giao thức sẽ được thực hiện với check nhưng sẽ k load trược tiếp mà 
// //load thông qua biến trung gian. 

const multer = require('multer');
const test = require('./validators');

const {handleErrors, requireAuth} = require('./middleware');
const productsRepo = require('../../respositories/products');
const productNewTemplate = require('../../views/admin/products/new')
const productsIndexTemplate = require('../../views/admin/products/index')
const productEditTeamplate = require('../../views/admin/products/edit')

const router = express.Router();
const upload = multer({storage: multer.memoryStorage()})

router.get('/admin/products',requireAuth ,async (req,res)=>{
  
  const products = await productsRepo.getAll();
  // console.log(products)
  res.send(productsIndexTemplate(products))
})


//hien thi form len gai dien web 
router.get('/admin/products/new', requireAuth,(req,res)=>{
    res.send(productNewTemplate({}))
  })
  

// gui data tu form len server 
router.post('/admin/products/new',
upload.single('image')//  middleware  này để upload file . NẾu vupload thành công thì phía sau mới 
//chạy dk tiếp. phương thức này được xem giữa route và function phía sau đóng vai trò là miadleware 
//để xử lí các dạng dữ liệu để phục vụ cho việc upload ảnh lên . Bản thân nó vẫn
// lấy dữ liệu từ input đó chỉ khác dữ liệu đưa vào đã được mã hóa.
,
  [       //  middleware  này để xác thực
     test.requireTitle,
     test.requirePrice
  ]
,
  handleErrors(productNewTemplate)
,
async (req,res)=>{ // đăng kí tài khoản
  
  const {title, price }  = req.body;
  const image = req.file.buffer.toString('base64')
  // console.dir( productsRepo.create)
  await productsRepo.create({title, price, image})

  console.log('data gui len server la: ', req.body, req.file);
  // console.log(req.file.buffer.toString('base64'))
  
  res.redirect('/admin/products')
  
}
)

router.get('/admin/products/:id/edit', requireAuth,async (req,res)=>{
  const product =await productsRepo.getOne(req.params.id)
  if (!product) {
    res.send('san pham khong ton tai')
  }else{
    res.send(productEditTeamplate({product}))
  }
})

router.post('/admin/products/:id/edit',
  requireAuth,
 upload.single('image') ,
  [       //  middleware  này để xác thực
    test.requireTitle,
    test.requirePrice
  ]
  ,
  handleErrors(productNewTemplate),

  async (req,res)=>{
    const changes  = req.body;
    if(req.file){
      changes.image = req.file.buffer.toString('base64');
    }
    try {
     await productsRepo.update(req.params.id, changes)
    } catch (error) {
      return res.send('<h1> Không tìm thấy sản phẩm để sửa </h1>');
    }

  res.redirect('/admin/products')

})

router.post('/admin/products/:id/delete', requireAuth, async (req,res)=>{
  await productsRepo.delete(req.params.id);
  res.redirect('/admin/products')

})


module.exports = router;