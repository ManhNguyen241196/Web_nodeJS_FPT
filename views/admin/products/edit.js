const layout = require('../layout')



module.exports = ({product})=>{
    return layout({
        content: `
        <div class="columns is-centered">
         <div class="column is-half">
           <h1 class="subtitle">Edit Product</h1>
 
           <form method="POST" enctype="multipart/form-data">
             <div class="field">
               <label class="label">Title</label>
               <input class="input" value="${product.title}" name="title">
             </div>
             
             <div class="field">
               <label class="label">Price</label>
               <input class="input" value="${product.price}" name="price">
             </div>
             
             <div class="field">
               <label class="label">Image</label>            
               <input type="file" name="image"  />
             </div>
             <br />
             <form method="post">
                <button class="button is-primary">Edit</button>
             </form>
           </form>
         </div>
       </div>
        
        `
    })
}