const express = require('express');
const cartRepo = require('../../respositories/carts')

const router = express.Router();

// router.get('/resetCartId', (req,res)=>{
//     req.session.cartId = ''
//     res.send('đã reset cart id')
// })

router.get('/getCartId', (req,res)=>{
    res.send(`cardId cua gio hang la: ${req.session.cartId}`)
})

router.post('/cart/products', async (req,res)=>{
    let cart;  
    //kierm tra xem nguoi dung da co giỏ hàng tạm thời được tạo ra khi ng dùng click chọn 1 sản phẩm hay chưa.
    //hya nói cách khác kiểm tra xem họ có phải vừa mới vào website hay không = cách xác nhận xem sự tồn tại của session
    //và cookies tương ứng. 
    
    if(!req.session.cartId){  //cartId chi được tạo khi người dùng thực sự nhấp vào button cart.
      cart = await cartRepo.create({items : []})
      req.session.cartId = cart.id
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

module.exports = router;
