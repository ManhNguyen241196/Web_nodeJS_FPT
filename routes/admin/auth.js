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
    test.test1,
    test.test2,
    test.checkpassConfirms
 ],
 async (req,res)=>{ // đăng kí tài khoản
    const errors = validationResult(req)
    console.log(errors.mapped())
  
   const {email, password, passwordConfirmation} =req.body;

   if(!errors.isEmpty()){
    return res.send(signupTemplate({req, errors}));
   }
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
    res.send(signinTemplate({})) //signinTemplate({}) là một function có 1 đối số errors để xử lí. Đối
    //số này là bắt buộc tuy nhiên in this case có thể truyền 1 đối số trống để nó k hiển thị
    //lỗi
})  //loggin tài khoản

router.post('/signin',
 [
    check('email').trim()
     .normalizeEmail()
     .isEmail()
     .withMessage('Must be a valid email')
     .custom(async (email)=>{
        const user = await usersRepo.getOneBy({email});
        if(!user){
         throw new Error('Email không tồn tại');
        }
     }),
     
    check('password').trim()
    .custom(async (password, {req})=>{
      const user = await usersRepo.getOneBy({email: req.body.email});
       if (!user) {
         throw new Error('Sai mật khẩu');
         
       }
      const validPassword = await usersRepo.comparePassword(
         user.password,
         password
        )
        if(!validPassword){
         throw new Error('Sai mật khẩu');
        }
      })
 ]
 ,async (req,res)=>{

    const errors = validationResult(req)   //lấy kết quả check từ biến req
    //từ client yêu cầu lên server 
    console.log(errors.mapped())

    if(!errors.isEmpty()){   //nếu có lỗi sẽ chạy hiển thị trong template
      return res.send(signinTemplate({req, errors}));
    }

   const {email,password} = req.body;
   const user = await usersRepo.getOneBy({email});
   //neu cac dieu kiejn treen cos 1 cai sai nó sẽ chạy return để kết thúc function chứ
  //  không chạy tiếp xuống để tạo req.session.
   req.session.useId = user.id  //sau khi đăng nhập thành công sẽ tiến hành tại phiên làm
   //việc đầu tiên. 
   res.redirect('/admin/products');
})

router.get('/',(req,res)=>{
  console.clear();
  res.send("sever khoi dong thanh cong")

})

module.exports = router;