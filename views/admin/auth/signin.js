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
    return layout({content: 
        `
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-one-quarter">
              <form method="POST">
                <h1 class="title">Sign in</h1>
                <div class="field">
                  <label class="label">Email</label>
                  <input required class="input" placeholder="Email" name="email" />
                  <p class="help is-danger">${getError(errors, 'email')}</p>
                </div>
                <div class="field">
                  <label class="label">Password</label>
                  <input required class="input" placeholder="Password" name="password" type="password" />
                  <p class="help is-danger">${getError(errors, 'password')}</p>
                </div>
                <button class="button is-primary">Submit</button>
              </form>
              <a href="/signup">Need an account? Sign Up</a>
            </div>
          </div>
        </div>
      `
    })
}