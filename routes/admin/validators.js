const { check } = require('express-validator');
const usersRepo = require('../../respositories/users')

module.exports = {
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