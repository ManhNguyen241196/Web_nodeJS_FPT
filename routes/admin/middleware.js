const {check, validationResult} = require('express-validator');

module.exports={
    handleErrors(templateFunc){
        return (req,res,next)=>{
            const errors = validationResult(req)
            console.log(errors.mapped())

            if(!errors.isEmpty()) {
                res.send(templateFunc({errors}))
            }

            next();
        }
    },

    requireAuth(req,res,next){
        if(!req.session.useId){
            console.log('chuwa dang nhap')
            return res.redirect('/signin')
        }

        next();
    }

    
}