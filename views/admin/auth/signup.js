const layout = require('../layout')

const getError = (errors, prop)=>{
   try {
    return errors.mapped()[prop].msg   //[prop] chính là các gọi biến đóng vai trò là key trong 1 object  
   } catch (error) {
     return ''
   }  
}

module.exports=({req, errors}) =>{
    return layout({content: `  
    <div>
        your ID is: ${req.session.userID}
        <form method="POST">
            <input name="email" placeholder="email" />
            ${getError(errors, 'email')}
            <input name="password" placeholder="password" />
            ${getError(errors, 'password')}         
            <input name="passwordConfirmation" placeholder="password confirmation" />
            ${getError(errors, "passwordConfirmation")}
            <button type="submit">sign up</button>
        </form>
    </div>     
     `
     })
}