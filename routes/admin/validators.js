//tất cả các xác thực liên quan tới validator của admin sẽ đều đưa vào trong 1 file 
//mot file dưới djang 1 object . khi nào cần sẽ gọi trực tiếp tới keys để lấy yếu tố xác
// thực . DO đó chỉ cần gọi chung 1 link 

// bản thân việc sử dụng check() theo dạng module của express-validator sẽ làm ngắn 
//gọn lại quá trìn h viết logic cho việc xác thực vì nó viết sẵn hết các logic có thể 
//chạy dk rồi. 
//express-validator dùng riêng hcor thể loại xác thực data trong các yếu tố ở form.

const { check } = require('express-validator');
const usersRepo = require('../../respositories/users')

module.exports = {
    requireTitle: check('title').trim()
    .isLength({min:4 , max: 40})
    .withMessage('Độ dài kí tự từ 4-40 kí tự'),

    requirePrice: check('price').trim()
    .toFloat()
    .toFloat({min:1})
    ,
    
    test1: check('email').trim()
     .normalizeEmail()
     .isEmail()
     .withMessage('Must be a valid email')
     .custom(async (value)=>{
       const existingUser = await usersRepo.getOneBy({email: value});
       if(existingUser){
           throw new Error('Email in use');
       }
       // console.log(value)
     }),

    test2: check('password').trim()
     .isLength({min:4 , max: 16})
     .withMessage('password phải từ 4 -16 ki tu'),

    checkpassConfirms: check('passwordConfirmation').trim()
    .isLength({min:4 , max: 16})
    .withMessage('password phải từ 4 -16 ki tu')
    .custom((passwordConfirmation, {req}) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error('Passwords must match');
      }else{
          return true;
        
      }
    }),
}