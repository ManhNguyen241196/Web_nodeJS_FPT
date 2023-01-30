const { json } = require('express');
const fs = require('fs');
const crypto = require('crypto');
const util = require('util')

const scrypt = util.promisify (crypto.scrypt)

class UserRepository{
   constructor(filename){ // constructor này mỗi khi gọi mới phải định nghĩa 
    //thành 1 object mới với các biến(or các func) bắt buộc phải có được định 
    //nghĩa trong constructor.
     if(!filename){  //neu khi khai bao object moi ma k khai them bien filenam
        //thi sẽ báo lỗi 
        throw new Error('creating a repository requires a filename')
     }
     this.filename = filename;
     try {  //chạy thử test khối mã 
      fs.accessSync(this.filename) // thử truy cập vào đường link filename 
      //xem có tồn tại hay không. 
     } catch (error) {  // nếu có error sẽ trả lại kết quả phía sau.
      fs.writeFileSync(this.filename,'[]')
     }
   }

    async getAll(){ // dunfg bat dong bo la vi se ton thoi gian doc neu file nặng. Nếu
        //dùng đồng bộ sẽ phải chờ đợi cho tới khi đọc xong rồi mới chạy tiếp
        //rất mất thời gian

        //open the filename
        return JSON.parse(
            await fs.promises.readFile(this.filename,{  //đọc dữ liệu data trong file json.
                encoding: "utf8"
            })
        )
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

    async comparePassword(saved, supplied){
   //save -> dữ liệu mật khẩu đã lưu ở file users.json dưới dạng 'asbc.xyz'
   // supplied la mat khau do user nhập vào để đăng nhập.
     const [hashed, salt] = saved.split('.')  //tajo array phân tách pass và salt
     const hashedSuppliedBuf = await scrypt(supplied, salt,64)

     return hashed === hashedSuppliedBuf.toString('hex') ;
    }


    async writeAll(records){
        await fs.promises.writeFile(this.filename, JSON.stringify(records,null,2))
    }

    randomId(){
       return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id){
       const records = await this.getAll();

      const findId = records.find((record)=>{
        return record.id === id;
       })

       if(findId){
        return findId
       }else(
        console.log('Khong tim thay Id nay')
       )
    }

    async delete(id){
        const records = await this.getAll();
        const filteredRecords = records.filter((record)=>{return record.id !== id});
        await this.writeAll(filteredRecords)
    }

    async update(id, attrs){
        const records = await this.getAll();
        const record = records.find((record)=>{
           return record.id === id;
        })

        if (!record) {
            throw new Error(`Record with ${id} not found`)
        }

        Object.assign(record,attrs);
        await this.writeAll(records);
    }

    async getOneBy(filters){
        const records = await this.getAll();
        
        for(let record of records){
            let found = true;

            for(let key in filters ){
                if(record[key] !== filters[key]){
                    found = false;
                }
            }

            if (found) {
                return record;
            }
        }

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