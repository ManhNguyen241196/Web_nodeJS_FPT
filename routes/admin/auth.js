const express = require('express');
const {check, validationResult} = require('express-validator');


const usersRepo = require('../../respositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require ('../../views/admin/auth/signin')

const test = require('./validators')


const router = express.Router();

router.get('/signup', (req,res)=>{
    res.send(signupTemplate({req}));
});

router.post('/signup',   //xen 1 middleware để validator form vao trước khi post data từ form lên server
 [
    // requireEmail,
    // requirePassword,
    // requirePasswordConfirmation,
    test.test2,
    test.test1,
    test.test3
   
 ],
 async (req,res)=>{ // đăng kí tài khoản
    console.clear()
    const errors = validationResult(req)
    console.log(errors)

   const {email, password, passwordConfirmation} =req.body;

    //creat user in repo
    const user = await usersRepo.create({email: email, password:password})
   
    // luu tru user cookie // req.session la 1 object. Moi phien lam viec se su dung 1 session 
    //khac nhau. Trong đối tượng session có thể trỏ thêm các thuộc tính khác chứa các thông tin
    //cần thiết khác sẽ dk gửi từ server về client và lưu trữ trên browser của user.
    req.session.userID = user.id

    res.send('Account created!!!')
})

router.get('/signout',(req,res)=>{   //đăng xuất
    req.session = null;    
    res.send('You are LOGGED OUT!')
})

router.get('/signin',(req,res)=>{
    res.send(signinTemplate())
})  //loggin tài khoản

router.post('/signin',async (req,res)=>{
   const {email,password} = req.body;

   const user = await usersRepo.getOneBy({email});
   if(!user){
    return res.send('Email không tồn tại');
   }
   
   const validPassword = await usersRepo.comparePassword(
    user.password,
    password
   )
   if(!validPassword){
     return res.send('Sai mật khẩu');
   }

   //neu cac dieu kiejn treen cos 1 cai sai nó sẽ chạy return để kết thúc function chứ
  //  không chạy tiếp xuống để tạo req.session.
   req.session.useId = user.id  //sau khi đăng nhập thành công sẽ tiến hành tại phiên làm
   //việc đầu tiên. 
   res.send('Đăng nhập thành công. Cookie bắt đầu có tác dụng');

})

module.exports = router;