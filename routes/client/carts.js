const express = require('express');
const cartRepo = require('../../respositories/carts')
const productsRepo = require('../../respositories/products')
const cartShowTemplate = require('../../views/admin/carts/show')

const router = express.Router();

// router.get('/resetCartId', (req,res)=>{
//     req.session.cartId = ''
//     res.send('đã reset cart id')
// })

// router.get('/getCartId', (req,res)=>{
//     res.send(`cardId cua gio hang la: ${req.session.cartId}`)
// })

router.post('/cart/products', async (req,res)=>{
    let cart;  
    //kierm tra xem nguoi dung da co giỏ hàng tạm thời được tạo ra khi ng dùng click chọn 1 sản phẩm hay chưa.
    //hya nói cách khác kiểm tra xem họ có phải vừa mới vào website hay không = cách xác nhận xem sự tồn tại của session
    //và cookies tương ứng. 
    
    if(!req.session.cartId){  //cartId chi được tạo khi người dùng thực sự nhấp vào button cart.
      cart = await cartRepo.create({items : []})
      req.session.cartId = cart.id //nếu không có cookies thì sẽ tạo bằng cách gán cho nó id của cart dk tạo trong respoProduct.creat()
    }else{
       cart = await cartRepo.getOne(req.session.cartId); //tìm ra phần tử trong array cart
        //thỏa mãn điều kiện nào đó. để nếu cart đã tồn tại, ng dùng đã nhấn và tạo 1 kết nối cartId bằng cookies với session của server 
        // thì sẽ lấy toàn bộ phần tử giỏ hàng đó ra 
    }

    //cart lúc này chính là giỏ hàng của user tại thười điểm này dk tạo mới or dk xác định 
    //thông qua hàm find()

    const existingItem = cart.items.find(function(item) {
        return item.id === req.body.productId;  //tim trong item cua giỏ hàng vừa định vị dk ,mã của sản phẩn mà vừa nhấn
        // và gửi 1 phản hồi tương ứng tới server. 
     })

     if (existingItem) {
        existingItem.quanity =  existingItem.quanity + 1;
     } else {  // nếu k tồn tại  product có sẵn thì sẽ phải thêm 1 object với thuộc tính như trên. 
        cart.items.push({id: req.body.productId, quanity: 1});
     }

  console.log(req.session)
  await cartRepo.update(cart.id, {items: cart.items} )
  res.redirect('/')
})

router.get('/cart', async (req,res)=>{
   if(!req.session.cartId){
      return res.redirect('/');
   }

   //nếu không exist req.session.cartId thì chứng tỏ chưa tồn tại giỏ hàng nên cũng k có gì để show cả
   const cart = await cartRepo.getOne(req.session.cartId)

   for (let item of cart.items){  //items tồn tại dưới dạng 1 array có các phần tử là các object chứa đặc tính của sản phẩm.
      //luc nay item cos dajn g object {id: id cua product, quanity: số lượng sản phẩm}
      const product = await productsRepo.getOne(item.id);
      
      item.product = product;  // gán thêm vào object trên 1 thuoc tính product có chứa object trọn vẹn của 
      //product trong khu vực lưu trữ gốc. 
   }
   res.send(cartShowTemplate({  // luôn đưa biến về trạng thái 1 object để sau nếu có thêm sẽ dễ quản lí . 
      items: cart.items,
   }))
})

router.post('/cart/products/delete', async (req,res)=>{
   const {itemId} = req.body
   const cart = await cartRepo.getOne(req.session.cartId)

   const items = cart.items.filter(function (item) {
     return  item.id !== itemId 
   })

   await cartRepo.update(req.session.cartId,{items})

   res.redirect('/cart')
})

module.exports = router;
