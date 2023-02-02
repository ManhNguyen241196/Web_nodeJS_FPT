const layout = require('../layout')

const getError = (errors, prop)=>{   // ham de lay msg ra khỏi object lỗi
    try {
     return errors.mapped()[prop].msg   //[prop] chính là các gọi biến đóng vai trò là key trong 1 object  
    } catch (error) {
      return ''
    }  
 }

module.exports = ({req, errors})=>{  //sau này khi gọi module này cũng sẽ đưa 2 biến
    //tương ứng vào và sử dụng các phương thức sau để xử lí. 
    return layout({content: `
    <div>
        <form method="POST">
            <input name="email" placeholder="email" />
            ${getError(errors,'email')}
            <input name="password" placeholder="password" />
            ${getError(errors,'password')}
            <button type="submit">Đăng nhập</button>
        </form>
    </div>
    `})
}