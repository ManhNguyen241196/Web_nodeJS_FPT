const { json } = require('express');
const fs = require('fs');
const crypto = require('crypto');
const util = require('util')
const Repository = require('./respository')

const scrypt = util.promisify (crypto.scrypt)

class UserRepository extends Repository{
    async comparePassword(saved, supplied){
        //save -> dữ liệu mật khẩu đã lưu ở file users.json dưới dạng 'asbc.xyz'
        // supplied la mat khau do user nhập vào để đăng nhập.
          const [hashed, salt] = saved.split('.')  //tajo array phân tách pass và salt
          const hashedSuppliedBuf = await scrypt(supplied, salt,64)
     
          return hashed === hashedSuppliedBuf.toString('hex') ;
    }
    async create(attrs){

        // biến attrs được khai báo đưa vào dưới dạng {email:'' , password:''}

        attrs.id = this.randomId();

        const salt =crypto.randomBytes(8).toString('hex');
       const buf = await scrypt(attrs.password, salt, 64)   //sử dụng await vì cần phải đợi hàm dk băm ra nữa.


        const records = await this.getAll();  //lay data trong file json hien 
        // tại dưới dạng mảng rồi push thêm data mới vào cuối của mảng rồi updat lại vào filename.json

        const record = {...attrs,
            password:  `${buf.toString('hex')}.${salt}`,
        }
        records.push(record);
        await this.writeAll(records) // chay 1 ham writeAll rieng để upload data len file
        return attrs;
    }

}


// const test = async()=>{ //phải có async vì trong nó có chứa hàm bất đồng bộ getAll()
//  const repo = new UserRepository('users.json'); // define 1 object mới từ khung mẫu UserRepository
// //  repo.create({
// //     email: 'ndmntt@gmail.com',
// //     password:'abc1234'
// //  })
// //  const users = await repo.getAll() // chạy hàm getAll
//  //  const user = await repo.getOne('d6cbc341')
//  //   const user = await repo.delete("1ff96980");
//  //  const user = await repo.update("f56f45f0" , {email: 'manhnguyen@gmail.com', addr:'hanoi'})
//  const user = await repo.getOneBy({email: "ndmntt@gmail.com",password: "abc4567"})
//  console.log(user)
// }

// test()

module.exports = new UserRepository('users.json');