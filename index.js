const express = require("express");
const bodyParser = require("body-parser")
const usersRepo = require('./respositories/users')
const cookieSession = require('cookie-session')
const authRouter = require('./routes/admin/auth')
const app = express();


app.use(bodyParser.urlencoded({extended:true}));  //đây chính là 1 middleware. app được khởi chạy 
//với module cài theo là express sua khi truy cập vào đường link ngay sau get hoặc post (bắt
//buộc phải có 1 định tuyến router tạo môi trường để thực hiện phương thức get or post)
//thì sẽ tiến hành chuyển data gửi từ form thành dạng req.body để dễ truy xuất rồi mới lấy dạng
// dữ liệu dễ theo dõi đó để thực hiện các hàm tiếp theo.

app.use(cookieSession({
    keys: ['asdffdsaasdffdsa']
}))

app.use(authRouter)

app.listen(3000,()=>{
    console.log('server is running...')
})