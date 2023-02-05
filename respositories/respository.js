//phần này là method tạo data store chung. nó chứa các phương thức mà bất
//kì kho dữ liệu nào cũng cần. khi vào case đặc thù có thể import sử dụng ké
//vào 1 class đã có sẵn


const fs = require('fs');
const crypto = require('crypto');

module.exports = class Repository{
  
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
    
        async create(attrs){    // attrs được đưa vào là 1 object 
            attrs.id = this.randomId();

            const records = await this.getAll();  // records được xây dựng là 1 array
            records.push(attrs);
            await this.writeAll(records);

            return attrs
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
    


    

