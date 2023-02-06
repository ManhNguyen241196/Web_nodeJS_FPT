const layout = require('../layout');


//khai bao phuong thuc getError để lấy các thông tin trong lỗi nếu có
const getError = (errors, prop)=>{
    try {
     return errors.mapped()[prop].msg   //[prop] chính là các gọi biến đóng vai trò là key trong 1 object  
    } catch (error) {
      return ''
    }  
 }

 module.exports = ({ errors }) => {
   return layout({
     content: `
       <div class="columns is-centered">
         <div class="column is-half">
           <h1 class="subtitle">Create a Product</h1>
 
           <form method="POST" enctype="multipart/form-data">
             <div class="field">
               <label class="label">Title</label>
               <input class="input" placeholder="Title" name="title">
               <p class="help is-danger">${getError(errors, 'title')}</p>
             </div>
             
             <div class="field">
               <label class="label">Price</label>
               <input class="input" placeholder="Price" name="price">
               <p class="help is-danger">${getError(errors, 'price')}</p>
             </div>
             
             <div class="field">
               <label class="label">Image</label>            
               <input type="file" name="image" />
             </div>
             <br />
             <button class="button is-primary">Create</button>
           </form>
         </div>
       </div>
     `
   });
 };