const express = require("express");
const bodyParser = require("body-parser")
const usersRepo = require('./respositories/users')
const cookieSession = require('cookie-session')

const app = express();


app.use(bodyParser.urlencoded({extended:true}));  //đây chính là 1 middleware. app được khởi chạy 
//với module cài theo là express sua khi truy cập vào đường link ngay sau get hoặc post (bắt
//buộc phải có 1 định tuyến router tạo môi trường để thực hiện phương thức get or post)
//thì sẽ tiến hành chuyển data gửi từ form thành dạng req.body để dễ truy xuất rồi mới lấy dạng
// dữ liệu dễ theo dõi đó để thực hiện các hàm tiếp theo.

app.use(cookieSession({
    keys: ['asdffdsaasdffdsa']
}))

app.get("/signup", (req,res)=>{
    res.send(`
      <div>
         your ID is:${req.session.userID}
         <form method="POST">
           <input name="email" placeholder="email" />
           <input name="password" placeholder="password" /> 
           <input name="passwordConfirmation" placeholder="password confirmation" /> 
           <button type="submit"> sign up </button>
         </form>
      </div>
    
    `)
})

app.post('/signup',async (req,res)=>{ // đăng kí tài khoản
   const {email, password, passwordConfirmation} =req.body;

   const existingUser = await usersRepo.getOneBy({email});
    if(existingUser){
        return res.send('Email in use')
    }

    if (password !== passwordConfirmation) {
        return res.send(' passwordConfirmation not match')
        
    }

    //creat user in repo
    const user = await usersRepo.create({email: email, password:password})
   
    // luu tru user cookie // req.session la 1 object. Moi phien lam viec se su dung 1 session 
    //khac nhau. Trong đối tượng session có thể trỏ thêm các thuộc tính khác chứa các thông tin
    //cần thiết khác sẽ dk gửi từ server về client và lưu trữ trên browser của user.
    req.session.userID = user.id

    res.send('Account created!!!')
})

app.get('/signout',(req,res)=>{   //đăng xuất
    req.session = null;    
    res.send('You are LOGGED OUT!')
})



app.get('/signin',(req,res)=>{
    res.send(`
    <div>
       <form method="POST">
         <input name="email" placeholder="email" />
         <input name="password" placeholder="password" /> 
         <button type="submit"> Đăng nhập </button>
       </form>
    </div>
  
  `)
})  //loggin tài khoản

app.post('/signin',async (req,res)=>{
   const {email,password} = req.body;

   const user = await usersRepo.getOneBy({email});
   if(!user){
    return res.send('Email không tồn tại');
   }

   if(user.password !== password){
     return res.send('Sai mật khẩu');
   }

   req.session.useId = user.id  //sau khi đăng nhập thành công sẽ tiến hành tại phiên làm
   //việc đầu tiên. 
   res.send('Đăng nhập thành công. Cookie bắt đầu có tác dụng');

})

app.listen(3000,()=>{
    console.log('server is running...')
})