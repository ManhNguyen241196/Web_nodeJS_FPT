const layout = require('../layout');


//khai bao phuong thuc getError để lấy các thông tin trong lỗi nếu có
const getError = (errors, prop)=>{
    try {
     return errors.mapped()[prop].msg   //[prop] chính là các gọi biến đóng vai trò là key trong 1 object  
    } catch (error) {
      return ''
    }  
 }

 module.exports=({errors}) =>{return layout({content: 
    ` 
    <form method="post" enctype="multipart/form-data">
          <input placeholder="Title" name="title" type="text">
          <input placeholder="Price" name="price" type="text">
          <input  type="file" name="image">
          <button type="submit">Submit</button>
    </form>

    `
 })
}
 